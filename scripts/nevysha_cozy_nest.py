import asyncio
import json
import mimetypes
import os
import socket
import subprocess
import sys
import threading

import gradio as gr
import modules
from PIL import Image
from PIL.PngImagePlugin import PngInfo
from typing import Any
from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
import websockets
from modules import script_callbacks, shared, call_queue, scripts

from scripts import tools
from scripts.CozyNestConfig import CozyNestConfig
from scripts.cozynest_image_browser import start_server
from scripts.tools import output_folder_array


def request_restart():
    shared.state.interrupt()
    shared.state.need_restart = True
    try:
        # check if modules.shared has restart_server function
        if hasattr(modules.shared, 'restart_server'):
            # restart server (if it exists
            modules.shared.restart_server(restart=True)
    except:
        pass


def update():
    git = os.environ.get('GIT', "git")

    subdir = os.path.dirname(os.path.abspath(__file__))

    # perform git pull in the extension folder
    output = subprocess.check_output([git, '-C', subdir, 'pull', '--autostash'])
    print(output.decode('utf-8'))


def is_port_free(port):
    # Create a socket object
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        # Try to bind the socket to the specified port
        sock.bind(("localhost", port))
        return True
    except socket.error:
        return False
    finally:
        # Close the socket
        sock.close()


def serv_img_browser_socket(server_port=3333, auto_search_port=True, cnib_output_folder=None):
    if cnib_output_folder is None or cnib_output_folder == []:
        print("CozyNest: No output folder specified for image browser. Aborting.")
        return

    # check if port is free
    if auto_search_port:
        while not is_port_free(server_port) and server_port < 64000:
            print(f"CozyNest: Port {server_port} is already in use. Searching for a free port.")
            server_port += 1

    try:
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # add the CozyNest extension to the sys.path.
        sys.path.append(parent_dir)
        # start the server in a separate process
        start_server_in_dedicated_process(cnib_output_folder, server_port)
        return server_port
    except Exception as e:
        print("CozyNest: Error while starting socket server")
        print(e)


def start_server_in_dedicated_process(_images_folders, server_port):
    def run_server():
        asyncio.run(start_server(_images_folders, server_port, stopper))

    stopper = threading.Event()

    def stop_server():
        stopper.set()

    # Start the server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    script_callbacks.on_before_reload(stop_server)


def gradio_hidden_field(server_port):
    # text with port number
    gr.Textbox(elem_id='cnib_socket_server_port', value=f"{server_port}", label="Server port READONLY",
               readonly=True, visible=False)
    with gr.Row(elem_id='nevysha-send-to'):
        html = gr.HTML()
        generation_info = gr.Textbox(visible=False, elem_id="nevysha_pnginfo_generation_info")
        html2 = gr.HTML()
        image = gr.Image(elem_id="nevysha_pnginfo_image", label="Source", source="upload", interactive=True,
                         type="pil")
        image.change(
            fn=call_queue.wrap_gradio_call(modules.extras.run_pnginfo),
            inputs=[image],
            outputs=[html, generation_info, html2],
        )
        with gr.Row(elem_id='nevysha-send-to-button'):
            buttons = modules.generation_parameters_copypaste.create_buttons(
                ["txt2img", "img2img", "inpaint", "extras"])

        for tabname, button in buttons.items():
            modules.generation_parameters_copypaste.register_paste_params_button(
                modules.generation_parameters_copypaste.ParamBinding(
                    paste_button=button, tabname=tabname, source_text_component=generation_info,
                    source_image_component=image,
                ))


_server_port = None


def on_ui_tabs():
    global _server_port

    config = CozyNestConfig()

    # check if the user has disabled the image browser
    disable_image_browser_value = config.get('disable_image_browser')

    auto_start_server = config.get('auto_start_server')

    server_port = None
    if not disable_image_browser_value and auto_start_server:
        server_port = serv_img_browser_socket(
            config.get('server_default_port'),
            config.get('auto_search_port'),
            config.get('cnib_output_folder')
        )
        _server_port = server_port
    else:
        print("CozyNest: Image browser is disabled. To enable it, go to the CozyNest settings.")

    def on_image_saved(gen_params: script_callbacks.ImageSaveParams):
        base_dir = scripts.basedir()

        if not os.path.isabs(gen_params.filename):
            path = os.path.normpath(os.path.join(base_dir, gen_params.filename))
        else:
            path = gen_params.filename

        images_folders = output_folder_array()
        # check if the image is in one of the output folders
        if not any([path.startswith(folder) for folder in images_folders]):
            return

        data = tools.get_exif(path)
        tools.new_image(data)

        asyncio.run(send_to_socket({
            'what': 'image_saved',
            'data': data,
        }, server_port))

    if not disable_image_browser_value:
        script_callbacks.on_image_saved(on_image_saved)

    with gr.Blocks(analytics_enabled=False) as ui:
        # header
        gr.HTML(value="<div class='nevysha settings-nevyui-top'>"
                      "<p class='nevysha-reporting'>Found a bug or want to ask for a feature ? Please "
                      "<a onClick='gatherInfoAndShowDialog();return false;' href='_blank'>click here to gather relevant info</a>"
                      " then use <a href='https://www.reddit.com/r/NevyshaCozyNest/'>this subreddit</a>"
                      " or <a href='https://github.com/Nevysha/Cozy-Nest'>github</a>. "
                      "You can also join this <a href='https://discord.gg/yppzDXjT7S'>discord server</a> to discuss about Cozy Nest</p>"
                      "</div>")

        # hidden field to store some useful data and trigger some server actions (like "send to" txt2img,...)
        gradio_hidden_field(server_port)

    return [(ui, "Nevysha Cozy Nest", "nevyui")]


cwd = os.path.normpath(os.path.join(__file__, "../../"))


async def send_to_socket(data, server_port):
    async with websockets.connect(f'ws://localhost:{server_port}') as websocket:
        try:
            while True:
                # Send data to the server
                data = json.dumps(data).encode('utf-8')
                await websocket.send(data)

                # Receive response from the server
                await websocket.recv()
                await websocket.close()
                break

        except Exception:
            pass


def cozy_nest_api(_: Any, app: FastAPI, **kwargs):
    app.mount(
        "/cozy-nest-client/",
        StaticFiles(directory=f"{cwd}/client/"),
        name="cozy-nest-client",
    )

    @app.post("/cozy-nest/config")
    async def save_config(request: Request):
        # Access POST parameters
        data = await request.json()

        config = CozyNestConfig()

        config.save_settings(data)

        return {"message": "Config saved successfully"}

    @app.delete("/cozy-nest/config")
    async def delete_config():
        config = CozyNestConfig()
        config.reset_settings()
        return {"message": "Config deleted successfully"}

    @app.get("/cozy-nest/reloadui")
    async def reload_ui():
        request_restart()

    @app.get("/cozy-nest/image")
    async def get_image(path: str):
        # Open the file in binary mode
        try:
            with open(path, "rb") as file:
                contents = file.read()

            # Get the MIME type of the file
            content_type, _ = mimetypes.guess_type(path)

            # Create a response with the file contents and appropriate content type
            response = Response(content=contents, media_type=content_type)
            response.headers["Content-Disposition"] = f'attachment; filename="{path}"'

            return response

        except FileNotFoundError:
            tools.delete_img_data(path)
            return Response(status_code=404, content="File not found")

    @app.delete("/cozy-nest/image")
    async def delete_image(path: str):
        try:
            os.remove(path)
            tools.delete_img_data(path)
            return {"message": "File deleted successfully"}
        except FileNotFoundError:
            return Response(status_code=404, content="File not found")

    @app.delete("/cozy-nest/index")
    async def delete_index():
        global _server_port

        config = CozyNestConfig()
        cnib_output_folder = config.get('cnib_output_folder')
        if cnib_output_folder and cnib_output_folder != "":
            tools.delete_index()

            def _scrap():
                try:
                    data = tools.scrap_image_folders(cnib_output_folder)
                    asyncio.run(send_to_socket({
                        'what': 'index_built',
                        'data': data['images'],
                    }, _server_port))
                finally:
                    pass

            thread = threading.Thread(target=_scrap)
            thread.start()
            return {"message": "Index deleted successfully, rebuilding index in background"}
        else:
            return Response(status_code=412, content="Missing output folder in config")

    @app.put('/cozy-nest/image')
    async def move_image(request: Request, path: str):
        try:
            request_json = await request.json()
            is_archive = request_json['archive']
            if not is_archive:
                # do nothing for now
                return Response(status_code=501, content="unimplemented")

            config = CozyNestConfig()
            archive_path = config.get('archive_path')
            if not archive_path or archive_path == "":
                # return {"message": "archive path not set"}
                return Response(status_code=412, content="archive path not set")

            # check if archive path exists
            if not os.path.exists(archive_path):
                return Response(status_code=412, content=f"archive path:{archive_path} does not exist")

            new_path = os.path.join(archive_path, os.path.basename(path))

            os.rename(path, new_path)
            tools.delete_img_data(path)
            return {"message": "File moved successfully"}
        except FileNotFoundError:
            return Response(status_code=404, content="File not found")

    @app.get("/cozy-nest/image-exif")
    async def get_image_exif(path: str):

        src_info = tools.get_image_exif(path)

        return Response(content=json.dumps(src_info), media_type="application/json")

    @app.post("/cozy-nest/image-exif")
    async def set_image_exif(request: Request):
        # Access POST parameters
        request_json = await request.json()
        data = request_json['data']
        path = request_json['path']
        image = Image.open(path)
        image.load()

        tgt_info = PngInfo()

        for key, value in data.items():
            tgt_info.add_text(key, str(value))

        image.save(path, pnginfo=tgt_info)
        tools.update_img_data(path)

        return {"message": "EXIF data saved successfully"}

    @app.get("/cozy-nest/extra-networks")
    async def get_extra_networks():
        pass


def init_extra_networks(_: Any, app: FastAPI, **kwargs):
    from scripts.cozy_extra_network import CozyExtraNetworksClass

    CozyExtraNetworks = CozyExtraNetworksClass(CozyNestConfig())
    CozyExtraNetworks.create_api_route(app)


script_callbacks.on_ui_tabs(on_ui_tabs)
script_callbacks.on_app_started(cozy_nest_api)
script_callbacks.on_app_started(init_extra_networks)
