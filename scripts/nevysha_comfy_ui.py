
import gradio as gr
import os
import json

from modules import scripts, script_callbacks, shared, sd_hijack


def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)


def hex_to_rgb(hex):
    rgb = []
    for i in (0, 2, 4):
        decimal = int(hex[i:i+2], 16)
        rgb.append(decimal)

    return tuple(rgb)


CONFIG_FILENAME = 'extensions/a1111-nevysha-comfy-ui/nevyui_settings.json'


def save_settings(main_menu_position,
                  accent_generate_button,
                  font_size,
                  waves_color,
                  bg_gradiant_color,
                  accent_color):
    # create the file in extensions/a1111-nevysha-comfy-ui if it doesn't exist
    if not os.path.exists(CONFIG_FILENAME):
        open(CONFIG_FILENAME, 'w').close()

    # save each settings inside the file
    with open(CONFIG_FILENAME, 'w') as f:
        f.write(json.dumps({
            'main_menu_position': main_menu_position,
            'accent_generate_button': accent_generate_button,
            'font_size': font_size,
            'waves_color': waves_color,
            'bg_gradiant_color': bg_gradiant_color,
            'accent_color': accent_color,
        }))
        f.close()


def get_dict_from_config():
    if not os.path.exists(CONFIG_FILENAME):
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
        'waves_color': rgb_to_hex(94, 26, 145),
        'bg_gradiant_color': rgb_to_hex(101, 0, 94),
        'accent_color': rgb_to_hex(92, 175, 214),
    }


def reset_settings():
    config = get_default_settings()
    save_settings(
        config.get('main_menu_position'),
        config.get('accent_generate_button'),
        config.get('font_size'),
        config.get('waves_color'),
        config.get('bg_gradiant_color'),
        config.get('accent_color'),
    )


def request_restart():
    shared.state.interrupt()
    shared.state.need_restart = True


def on_ui_tabs():

    json_object = json.dumps(shared.opts.data, indent=2)

    with gr.Blocks(analytics_enabled=False) as ui:
        with gr.Column(elem_id="nevyui-ui-block"):
            # shared options
            config = get_dict_from_config()

            # header
            gr.HTML(value="<div class='nevysha settings-nevyui-top'><h2>Nevysha Comfy UI</h2>"
                          "<p class='info'>A collection of tweaks to make Auto1111 webui more comfy to use</p>"
                          "<p class='reporting'>Found a bug or want to ask for a feature ? Please use "
                          "  <a href='https://www.reddit.com/r/NevyshaComfyUi/'>this subreddit</a>"
                          " or <a href='https://github.com/Nevysha/a1111-nevysha-comfy-ui'>github</a></p>"
                          "<p class='warning'>WARNING : Settings are immediately applied but will not be saved until you click \"Save\"</p></div>")

            # main menu
            main_menu_position = gr.Radio(value=config.get('main_menu_position'), label="Main menu position", choices=['left', 'top'], elem_id="setting_nevyui_menuPosition", interactive=True)
            accent_generate_button = gr.Checkbox(value=config.get('accent_generate_button'), label="Accent Generate Button", elem_id="setting_nevyui_accentGenerateButton", interactive=True)
            font_size = gr.Slider(value=config.get('font_size'), label="Font size", minimum=10, maximum=18, step=1, elem_id="setting_nevyui_fontSize", interactive=True)

            with gr.Row():
                waves_color = gr.ColorPicker(value=config.get('waves_color'), label="Waves color", elem_id="setting_nevyui_waveColor", interactive=True)
                bg_gradiant_color = gr.ColorPicker(value=config.get('bg_gradiant_color'), label="Background gradiant color", elem_id="setting_nevyui_bgGradiantColor", interactive=True)
                accent_color = gr.ColorPicker(value=config.get('accent_color'), label="Accent color", elem_id="setting_nevyui_accentColor", interactive=True)

            with gr.Row(elem_id='nevysha-saved-feedback-wrapper'):
                gr.HTML(value="<div id='nevysha-saved-feedback' class='nevysha nevysha-feedback' style='display:none;'>Saved !</div>")
                gr.HTML(value="<div id='nevysha-reset-feedback' class='nevysha nevysha-feedback' style='display:none;'>Reset !</div>")
                gr.HTML(value="<div id='nevysha-dummy-feedback' class='nevysha nevysha-feedback' style='display:none;' />")

            with gr.Row():
                btn_save = gr.Button(value="Save", elem_id="nevyui_sh_options_submit", elem_classes="nevyui_apply_settings")
                btn_save.click(save_settings, inputs=[
                    main_menu_position,
                    accent_generate_button,
                    font_size,
                    waves_color,
                    bg_gradiant_color,
                    accent_color,
                ], outputs=[])

                btn_reset = gr.Button(value="Reset default (Reload UI needed to apply)", elem_id="nevyui_sh_options_reset", elem_classes="nevyui_apply_settings")
                # restore default settings
                btn_reset.click(reset_settings)

                btn_reload = gr.Button(value="Reload UI", elem_id="nevyui_sh_options_reset", elem_classes="nevyui_apply_settings")
                # reload the page
                btn_reload.click(
                    fn=request_restart,
                    _js='restart_reload',
                    inputs=[],
                    outputs=[],)

            # footer
            gr.HTML(value="<div class='nevysha settings-nevyui-bottom'>"
                          "  <p class='info'>Made by Nevysha with luv</p>"
                          "</div>", elem_id="nevyui_footer_wrapper")

    return [(ui, "Nevysha Comfy UI", "nevyui")]


script_callbacks.on_ui_tabs(on_ui_tabs)
