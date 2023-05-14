import asyncio
import json
import os
import socket
import subprocess
import sys
import threading

import gradio as gr
import modules
import websockets
from PIL import Image
from PIL.ExifTags import TAGS
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
                         waves_color,
                         bg_gradiant_color,
                         accent_color,
                         card_height,
                         card_width,
                         error_popup,
                         disable_image_browser, ):
    settings = {
        'main_menu_position': main_menu_position,
        'quicksettings_position': quicksettings_position,
        'accent_generate_button': accent_generate_button,
        'font_size': font_size,
        'waves_color': waves_color,
        'bg_gradiant_color': bg_gradiant_color,
        'accent_color': accent_color,
        'card_height': card_height,
        'card_width': card_width,
        'error_popup': error_popup,
        'disable_image_browser': disable_image_browser,
    }

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
        'waves_color': rgb_to_hex(94, 26, 145),
        'bg_gradiant_color': rgb_to_hex(101, 0, 94),
        'accent_color': rgb_to_hex(92, 175, 214),
        'card_height': '8',
        'card_width': '13',
        'error_popup': True,
        'disable_image_browser': True,
    }


def reset_settings():
    save_settings(
        get_default_settings())


def request_restart():
    shared.state.interrupt()
    shared.state.need_restart = True


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


def serv_img_browser_socket(server_port=3333, auto_search_port=True):
    # check if port is free
    if auto_search_port:
        # search for a free port
        server_port = 3333
        while not is_port_free(server_port) and server_port < 64000:
            print(f"CozyNest: Port {server_port} is already in use. Searching for a free port.")
            server_port += 1

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

    try:
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # add the CozyNest extension to the sys.path.
        sys.path.append(parent_dir)
        # start the server in a separate process
        start_server_in_dedicated_process(images_folders, server_port)
        return server_port
    except Exception as e:
        print("CozyNest: Error while starting socket server")
        print(e)


def start_server_in_dedicated_process(_images_folders, server_port):
    def run_server():
        asyncio.run(start_server(_images_folders, server_port))

    # Start the server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.start()


def on_ui_tabs():
    # shared options
    config = get_dict_from_config()
    # merge default settings with user settings
    config = {**get_default_settings(), **config}
    # save the merged settings
    save_settings(config)

    # check if the user has disabled the image browser
    disable_image_browser_value = config.get('disable_image_browser')

    server_port = None
    if not disable_image_browser_value:
        server_port = serv_img_browser_socket()
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

        asyncio.run(send_to_socket({
            'what': 'image_saved',
            'data': get_exif(path),
        }))

    if not disable_image_browser_value:
        script_callbacks.on_image_saved(on_image_saved)

    with gr.Blocks(analytics_enabled=False) as ui:

        # TODO add settings (maybe in a tab) for the image browser
        #  - chose port number
        #  - chose folders to scrap (may be multiple)
        #  - chose if the server should be started automatically

        with gr.Column(elem_id="nevyui-ui-block"):

            # check if user is on the old repo name and display a warning
            if EXTENSION_TECHNICAL_NAME != 'Cozy-Nest':
                gr.HTML(value="<div class='nevysha nevysha-warning'>"
                              "<p id='nevysha-rename-important-msg' class='nevysha-emphasis important'>WARNING : This extension has been renamed to Cozy Nest to avoid confusion with an other tool. "
                              "Please update to the latest version by following "
                              "<a href='https://github.com/Nevysha/Cozy-Nest/wiki/How-to-switch-to-renamed-repository-Cozy-Nest'>these instructions</a></p>")

            # header
            gr.HTML(value="<div class='nevysha settings-nevyui-top'><h2>Nevysha's Cozy Nest</h2>"
                          "<p class='info'>Find your cozy spot on Auto1111's webui</p>"
                          "<p class='nevysha-reporting'>Found a bug or want to ask for a feature ? Please "
                          "<a onClick='gatherInfoAndShowDialog();return false;' href='_blank'>click here to gather relevant info</a>"
                          " then use <a href='https://www.reddit.com/r/NevyshaCozyNest/'>this subreddit</a>"
                          " or <a href='https://github.com/Nevysha/Cozy-Nest'>github</a></p>"
                          "<p class='nevysha-emphasis'>WARNING : Settings are immediately applied but will not be saved until you click \"Save\"</p></div>")

            # disable_image_browser
            disable_image_browser = gr.Checkbox(value=config.get('disable_image_browser'),
                                                label="Disable image browser (requires reload UI)",
                                                elem_id="setting_nevyui_disableImageBrowser", interactive=True)

            # error popup checkbox
            error_popup = gr.Checkbox(value=config.get('error_popup'),
                                      label="Display information dialog on Cozy Nest error",
                                      elem_id="setting_nevyui_errorPopup", interactive=True)

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
                waves_color = gr.ColorPicker(value=config.get('waves_color'), label="Waves color",
                                             elem_id="setting_nevyui_waveColor", interactive=True)
                bg_gradiant_color = gr.ColorPicker(value=config.get('bg_gradiant_color'),
                                                   label="Background gradiant color",
                                                   elem_id="setting_nevyui_bgGradiantColor", interactive=True)
                accent_color = gr.ColorPicker(value=config.get('accent_color'), label="Accent color",
                                              elem_id="setting_nevyui_accentColor", interactive=True)

            with gr.Row(elem_id='nevysha-saved-feedback-wrapper'):
                gr.HTML(
                    value="<div id='nevysha-saved-feedback' class='nevysha nevysha-feedback' style='display:none;'>Saved !</div>")
                gr.HTML(
                    value="<div id='nevysha-reset-feedback' class='nevysha nevysha-feedback' style='display:none;'>Reset !</div>")
                gr.HTML(
                    value="<div id='nevysha-dummy-feedback' class='nevysha nevysha-feedback' style='display:none;' />")

            with gr.Row():
                btn_save = gr.Button(value="Save", elem_id="nevyui_sh_options_submit",
                                     elem_classes="nevyui_apply_settings")
                btn_save.click(gradio_save_settings, inputs=[
                    main_menu_position,
                    quicksettings_position,
                    accent_generate_button,
                    font_size,
                    waves_color,
                    bg_gradiant_color,
                    accent_color,
                    card_height,
                    card_width,
                    error_popup,
                    disable_image_browser
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

            # add button to trigger git pull
            btn_update = gr.Button(value="Update", elem_id="nevyui_sh_options_update", visible=False, )
            btn_update.click(
                fn=update,
                inputs=[],
                outputs=[], )

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

            # footer
            gr.HTML(value="<div class='nevysha settings-nevyui-bottom'>"
                          "  <p class='info'>Made by Nevysha with luv</p>"
                          "</div>", elem_id="nevyui_footer_wrapper")

    return [(ui, "Nevysha Cozy Nest", "nevyui")]


script_callbacks.on_ui_tabs(on_ui_tabs)
