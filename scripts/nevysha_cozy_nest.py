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
from typing import Any
from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
import websockets
from modules import script_callbacks, shared, call_queue, scripts

from scripts.cozynest_image_browser import start_server, get_exif


def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)


def hex_to_rgb(hex):
    rgb = []
    for i in (0, 2, 4):
        decimal = int(hex[i:i + 2], 16)
        rgb.append(decimal)

    return tuple(rgb)


# check parent folder name (2 level above) to ensure compatibility after repo rename
EXTENSION_TECHNICAL_NAME = os.path.basename(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CONFIG_FILENAME = f"extensions/{EXTENSION_TECHNICAL_NAME}/nevyui_settings.json"


def gradio_save_settings(main_menu_position,
                         quicksettings_position,
                         accent_generate_button,
                         font_size,
                         font_color,
                         font_color_light,
                         waves_color,
                         bg_gradiant_color,
                         accent_color,
                         card_height,
                         card_width,
                         error_popup,
                         disable_image_browser,
                         disable_waves_and_gradiant,
                         server_default_port,
                         auto_search_port,
                         auto_start_server,
                         fetch_output_folder_from_a1111_settings,
                         sfw_mode,
                         enable_clear_button,
                         enable_extra_network_tweaks,
                         ):
    settings = {
        'main_menu_position': main_menu_position,
        'quicksettings_position': quicksettings_position,
        'accent_generate_button': accent_generate_button,
        'font_size': font_size,
        'font_color': font_color,
        'font_color_light': font_color_light,
        'waves_color': waves_color,
        'bg_gradiant_color': bg_gradiant_color,
        'accent_color': accent_color,
        'card_height': card_height,
        'card_width': card_width,
        'error_popup': error_popup,
        'disable_image_browser': disable_image_browser,
        'disable_waves_and_gradiant': disable_waves_and_gradiant,
        'server_default_port': server_default_port,
        'auto_search_port': auto_search_port,
        'auto_start_server': auto_start_server,
        'fetch_output_folder_from_a1111_settings': fetch_output_folder_from_a1111_settings,
        'sfw_mode': sfw_mode,
        'enable_clear_button': enable_clear_button,
        'enable_extra_network_tweaks': enable_extra_network_tweaks,
    }

    current_config = get_dict_from_config()

    if current_config['cnib_output_folder']:
        settings['cnib_output_folder'] = current_config['cnib_output_folder']
    else:
        settings['cnib_output_folder'] = []

    if current_config['disable_image_browser']:
        settings['disable_image_browser'] = current_config['disable_image_browser']

    if current_config['fetch_output_folder_from_a1111_settings']:
        settings['fetch_output_folder_from_a1111_settings'] = current_config['fetch_output_folder_from_a1111_settings']

    if current_config['webui']:
        settings['webui'] = current_config['webui']

    save_settings(settings)


def save_settings(settings):
    # create the file in extensions/Cozy-Nest if it doesn't exist
    if not os.path.exists(CONFIG_FILENAME):
        open(CONFIG_FILENAME, 'w').close()
    # save each settings inside the file
    with open(CONFIG_FILENAME, 'w') as f:
        f.write(json.dumps(settings, indent=2))
        f.close()


def get_dict_from_config():
    if not os.path.exists(CONFIG_FILENAME):
        reset_settings()
        # return default config
        return get_default_settings()

    with open(CONFIG_FILENAME, 'r') as f:
        config = json.loads(f.read())
        f.close()
        return config


def get_default_settings():
    return {
        'main_menu_position': 'top',
        'accent_generate_button': False,
        'font_size': 12,
        'quicksettings_position': 'split',
        'font_color': '#d4d4d4',
        'font_color_light': rgb_to_hex(71, 71, 71),
        'waves_color': rgb_to_hex(94, 26, 145),
        'bg_gradiant_color': rgb_to_hex(101, 0, 94),
        'accent_color': rgb_to_hex(92, 175, 214),
        'card_height': '8',
        'card_width': '13',
        'error_popup': True,
        'disable_image_browser': True,
        'disable_waves_and_gradiant': False,
        'server_default_port': 3333,
        'auto_search_port': True,
        'auto_start_server': True,
        'fetch_output_folder_from_a1111_settings': True,
        'cnib_output_folder': [],
        'sfw_mode': False,
        'enable_clear_button': True,
        'enable_extra_network_tweaks': True,
        'webui': 'unknown'
    }


def reset_settings():
    save_settings(
        get_default_settings())


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


def output_folder_array():
    outdir_txt2img_samples = shared.opts.data['outdir_txt2img_samples']
    outdir_img2img_samples = shared.opts.data['outdir_img2img_samples']
    outdir_extras_samples = shared.opts.data['outdir_extras_samples']
    base_dir = scripts.basedir()
    # check if outdir_txt2img_samples is a relative path
    if not os.path.isabs(outdir_txt2img_samples):
        outdir_txt2img_samples = os.path.normpath(os.path.join(base_dir, outdir_txt2img_samples))
    if not os.path.isabs(outdir_img2img_samples):
        outdir_img2img_samples = os.path.normpath(os.path.join(base_dir, outdir_img2img_samples))
    if not os.path.isabs(outdir_extras_samples):
        outdir_extras_samples = os.path.normpath(os.path.join(base_dir, outdir_extras_samples))
    images_folders = [
        outdir_txt2img_samples,
        outdir_img2img_samples,
        outdir_extras_samples,
    ]
    return images_folders


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


def gradio_img_browser_tab(config):
    with gr.Column(elem_id="img_browser_main_block"):
        # disable_image_browser
        disable_image_browser = gr.Checkbox(value=config.get('disable_image_browser'),
                                            label="Disable image browser (Reload UI required)",
                                            elem_id="setting_nevyui_disableImageBrowser", interactive=True)

        with gr.Row():
            server_default_port = gr.Number(value=config.get('server_default_port'),
                                            label="Socket port for image browser", interactive=True, precision=0)
            auto_search_port = gr.Checkbox(value=True, label="Auto search port",
                                           elem_id="setting_nevyui_autoSearchPort",
                                           interactive=True)

            auto_start_server = gr.Checkbox(value=config.get('auto_start_server'), label="Auto start server",
                                            elem_id="setting_nevyui_autoStartServer",
                                            interactive=True, visible=False)

            fetch_output_folder_from_a1111_settings = gr.Checkbox(
                value=config.get('fetch_output_folder_from_a1111_settings'),
                label="Fetch output folder from a1111 settings (Reload needed to enable)",
                elem_id="setting_nevyui_fetchOutputFolderFromA1111Settings",
                interactive=True)

        # Add a text block to display each folder from output_folder_array()
        with gr.Blocks(elem_id="img_browser_folders_block"):
            # TODO refactor to remove this as it's no longer managed through gradio
            gr.Textbox(value=json.dumps(config.get('cnib_output_folder')), label="Output folder",
                       elem_id="cnib_output_folder", interactive=True, visible=False)

    return [
        disable_image_browser,
        server_default_port,
        auto_search_port,
        auto_start_server,
        fetch_output_folder_from_a1111_settings]


def gradio_main_tab(config):
    with gr.Column(elem_id="nevyui-ui-block"):
        with gr.Row():
            # error popup checkbox
            error_popup = gr.Checkbox(value=config.get('error_popup'),
                                      label="Display information dialog on Cozy Nest error",
                                      elem_id="setting_nevyui_errorPopup", interactive=True)

            # disable waves and gradiant bg
            disable_waves_and_gradiant = gr.Checkbox(value=config.get('disable_waves_and_gradiant'),
                                                     label="Disable waves and gradiant background animations",
                                                     elem_id="setting_nevyui_disableWavesAndGradiant", interactive=True)

        # main menu
        main_menu_position = gr.Radio(value=config.get('main_menu_position'), label="Main menu position",
                                      choices=['left', 'top', 'top_centered'],
                                      elem_id="setting_nevyui_menuPosition", interactive=True)
        quicksettings_position = gr.Radio(value=config.get('quicksettings_position'),
                                          label="Quicksettings position",
                                          choices=['left', 'split', 'centered'],
                                          elem_id="setting_nevyui_quicksettingsPosition", interactive=True)
        accent_generate_button = gr.Checkbox(value=config.get('accent_generate_button'),
                                             label="Accent Generate Button",
                                             elem_id="setting_nevyui_accentGenerateButton", interactive=True)

        with gr.Row():
            font_size = gr.Slider(value=config.get('font_size'), label="Font size", minimum=10, maximum=18, step=1,
                                  elem_id="setting_nevyui_fontSize", interactive=True)
            card_height = gr.Slider(value=config.get('card_height'), label="Extra network card height", minimum=5,
                                    maximum=20, step=1, elem_id="setting_nevyui_cardHeight", interactive=True)
            card_width = gr.Slider(value=config.get('card_width'), label="Extra network card width", minimum=5,
                                   maximum=20, step=1, elem_id="setting_nevyui_cardWidth", interactive=True)

        with gr.Row():
            font_color = gr.ColorPicker(value=config.get('font_color'), label="Font color",
                                         elem_id="setting_nevyui_fontColor", interactive=True, visible=False)

            font_color_light = gr.ColorPicker(value=config.get('font_color_light'), label="Font color",
                                              elem_id="setting_nevyui_fontColorLight", interactive=True, visible=False)

            waves_color = gr.ColorPicker(value=config.get('waves_color'), label="Waves color",
                                         elem_id="setting_nevyui_waveColor", interactive=True)
            bg_gradiant_color = gr.ColorPicker(value=config.get('bg_gradiant_color'),
                                               label="Background gradiant color",
                                               elem_id="setting_nevyui_bgGradiantColor", interactive=True)
            accent_color = gr.ColorPicker(value=config.get('accent_color'), label="Accent color",
                                          elem_id="setting_nevyui_accentColor", interactive=True)

        sfw_mode = gr.Checkbox(value=config.get('sfw_mode'),
                               label="SFW mode 👀 (blur all images)",
                               elem_id="setting_nevyui_sfwMode", interactive=True)

        return [
            accent_color,
            accent_generate_button,
            bg_gradiant_color,
            card_height,
            card_width,
            disable_waves_and_gradiant,
            error_popup,
            font_size,
            main_menu_position,
            quicksettings_position,
            font_color,
            font_color_light,
            waves_color,
            sfw_mode,
        ]


def ui_action_btn(accent_color, accent_generate_button, bg_gradiant_color, card_height, card_width,
                  disable_waves_and_gradiant, error_popup, font_size, main_menu_position,
                  quicksettings_position, font_color, font_color_light, waves_color, disable_image_browser, server_default_port,
                  auto_search_port,
                  auto_start_server,
                  fetch_output_folder_from_a1111_settings, sfw_mode, enable_clear_button, enable_extra_network_tweaks):
    with gr.Row():
        btn_save = gr.Button(value="Save", elem_id="nevyui_sh_options_submit",
                             elem_classes="nevyui_apply_settings")
        btn_save.click(gradio_save_settings, inputs=[
            main_menu_position,
            quicksettings_position,
            accent_generate_button,
            font_size,
            font_color,
            font_color_light,
            waves_color,
            bg_gradiant_color,
            accent_color,
            card_height,
            card_width,
            error_popup,
            disable_image_browser,
            disable_waves_and_gradiant,
            server_default_port,
            auto_search_port,
            auto_start_server,
            fetch_output_folder_from_a1111_settings,
            sfw_mode,
            enable_clear_button,
            enable_extra_network_tweaks,
        ], outputs=[])

        btn_reset = gr.Button(value="Reset default (Reload UI needed to apply)",
                              elem_id="nevyui_sh_options_reset", elem_classes="nevyui_apply_settings")
        # restore default settings
        btn_reset.click(reset_settings)

        btn_reload = gr.Button(value="Reload UI", elem_id="nevyui_sh_options_reset",
                               elem_classes="nevyui_apply_settings")
        # reload the page
        btn_reload.click(
            fn=request_restart,
            _js='restart_reload',
            inputs=[],
            outputs=[], )

        # start socket server
        btn_start = gr.Button(value="Start Socket Server", elem_id="nevyui_sh_options_start_socket",
                              elem_classes="nevyui_apply_settings")
        btn_start.click(
            fn=serv_img_browser_socket,
            inputs=[],
            outputs=[], )

    with gr.Row(elem_id='nevysha-saved-feedback-wrapper'):
        gr.HTML(
            value="<div id='nevysha-saved-feedback' class='nevysha nevysha-feedback' style='display:none;'>Saved !</div>")
        gr.HTML(
            value="<div id='nevysha-reset-feedback' class='nevysha nevysha-feedback' style='display:none;'>Reset !</div>")
        gr.HTML(
            value="<div id='nevysha-dummy-feedback' class='nevysha nevysha-feedback' style='display:none;' />")

    # add button to trigger git pull
    btn_update = gr.Button(value="Update", elem_id="nevyui_sh_options_update", visible=False, )
    btn_update.click(
        fn=update,
        inputs=[],
        outputs=[], )


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


def on_ui_tabs():

    # shared options
    config = get_dict_from_config()
    # merge default settings with user settings
    config = {**get_default_settings(), **config}

    if config['webui'] == 'unknown' and hasattr(shared, 'get_version'):
        version = shared.get_version()
        # check if the 'app' is 'sd.next'
        if version['app'] == 'sd.next':
            config['webui'] = 'sd.next'
            config['fetch_output_folder_from_a1111_settings'] = False
        else:
            config['webui'] = 'auto1111'
        save_settings(config)

    # check if cnib_output_folder is empty and/or need to be fetched from a1111 settings
    cnib_output_folder = config.get('cnib_output_folder')
    is_empty = cnib_output_folder == []
    if not cnib_output_folder or is_empty:
        cnib_output_folder = []

    if config.get('fetch_output_folder_from_a1111_settings'):
        # merge cnib_output_folder output_folder_array()
        cnib_output_folder = cnib_output_folder + list(set(output_folder_array()) - set(cnib_output_folder))

    config['cnib_output_folder'] = cnib_output_folder

    # save the merged settings
    save_settings(config)

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
    else:
        print("CozyNest: Image browser is disabled. To enable it, go to the CozyNest settings.")

    async def send_to_socket(data):
        async with websockets.connect(f'ws://localhost:{server_port}') as websocket:
            try:
                while True:
                    # Send data to the server
                    data = json.dumps(data).encode('utf-8')
                    await websocket.send(data)

                    # Receive response from the server
                    await websocket.recv()
                    websocket.close()
                    break

            except websockets.exceptions.ConnectionClosed:
                pass

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

        asyncio.run(send_to_socket({
            'what': 'image_saved',
            'data': get_exif(path),
        }))

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
                      "<p class='nevysha-emphasis'>WARNING : Some visual settings are immediately applied but will not be saved until you click \"Save\"</p></div>")

        with gr.Tabs(id="cozy_nest_settings_tabs", elem_id="cozy_nest_settings_tabs"):
            with gr.TabItem(label="Main Settings", elem_id="cozy_nest_settings_tab"):
                [
                    accent_color,
                    accent_generate_button,
                    bg_gradiant_color,
                    card_height,
                    card_width,
                    disable_waves_and_gradiant,
                    error_popup,
                    font_size,
                    main_menu_position,
                    quicksettings_position,
                    font_color,
                    font_color_light,
                    waves_color,
                    sfw_mode
                ] = gradio_main_tab(config)
            with gr.TabItem(label="Image Browser Settings", elem_id="cozy_nest_img_browser_settings_tab"):
                [
                    disable_image_browser,
                    server_default_port,
                    auto_search_port,
                    auto_start_server,
                    fetch_output_folder_from_a1111_settings,
                ] = gradio_img_browser_tab(config)
            with gr.TabItem(label="Others", elem_id="cozy_nest_others_settings_tab"):
                with gr.Column():
                    [
                        enable_clear_button,
                        enable_extra_network_tweaks
                    ] = gradio_others_settings(config)

        ui_action_btn(accent_color, accent_generate_button, bg_gradiant_color, card_height, card_width,
                      disable_waves_and_gradiant, error_popup, font_size, main_menu_position,
                      quicksettings_position, font_color, font_color_light, waves_color, disable_image_browser, server_default_port,
                      auto_search_port,
                      auto_start_server,
                      fetch_output_folder_from_a1111_settings, sfw_mode, enable_clear_button,
                      enable_extra_network_tweaks)

        # hidden field to store some useful data and trigger some server actions (like "send to" txt2img,...)
        gradio_hidden_field(server_port)

        # footer
        gr.HTML(value="<div class='nevysha settings-nevyui-bottom'>"
                      "  <p class='info'>Made by Nevysha with luv</p>"
                      "</div>", elem_id="nevyui_footer_wrapper")

    return [(ui, "Nevysha Cozy Nest", "nevyui")]


def gradio_others_settings(config):
    gr.HTML(value="<div id='cozynest_others_settings_header'>"
                  "<p>Those settings are heavy on DOM modification and might conflict with some others extensions</p>"
                  "<p>Reload UI needed to apply</p>"
                  "</div>")

    enable_clear_button = gr.Checkbox(label="Enable clear gallery button in txt2img and img2img tabs",
                                      value=config.get('enable_clear_button'), elem_id="cozynest_various_clearbtn")
    enable_extra_network_tweaks = gr.Checkbox(label="Enable extra network tweaks",
                                              value=config.get('enable_extra_network_tweaks'),
                                              elem_id="cozynest_various_extra_network_tweaks")

    return [enable_clear_button, enable_extra_network_tweaks]


cwd = os.path.normpath(os.path.join(__file__, "../../"))


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

        # shared options
        config = get_dict_from_config()
        # merge default settings with user settings
        config = {**get_default_settings(), **config,
                  **data}

        save_settings(config)

        return {"message": "Config saved successfully"}

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
            return Response(status_code=404, content="File not found")


script_callbacks.on_ui_tabs(on_ui_tabs)
script_callbacks.on_app_started(cozy_nest_api)
