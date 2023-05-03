
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


def on_ui_tabs():

    json_object = json.dumps(shared.opts.data, indent=2)

    with gr.Blocks(analytics_enabled=False) as ui:
        with gr.Column(elem_id="nevyui-ui-block"):
            # shared options
            gr.HTML(value="<script id='nevyui_sharedopts_script'>"+json_object+"</script>", elem_id="nevyui_sh_options", elem_classes="hidden")

            # header
            gr.HTML(value="<div class='nevysha settings-nevyui-top'><h2>Nevysha Comfy UI</h2>"
                          "<p class='info'>A collection of tweaks to make Auto1111 webui more comfy to use</p>"
                          "<p class='reporting'>Found a bug or want to ask for a feature ? Please use "
                            "<a href='https://www.reddit.com/r/NevyshaComfyUi/'>this subreddit</a>"
                          " or <a href='https://github.com/Nevysha/a1111-nevysha-comfy-ui'>github</a></p>"
                          "<p class='warning'>WARNING : Settings are immediately applied but will not be saved until you click \"Apply Settings\"</p></div>")

            # main menu
            gr.Radio(value='top', label="Main menu position", choices=['left', 'top'], elem_id="nevyui_menuPosition", interactive=True)
            gr.Checkbox(value=False, label="Accent Generate Button", elem_id="nevyui_accentGenerateButton")
            gr.Slider(value=12, label="Font size", minimum=10, maximum=18, step=1, elem_id="nevyui_fontSize")

            with gr.Row():
                gr.ColorPicker(value=rgb_to_hex(94, 26, 145), label="Waves color", elem_id="nevyui_waveColor")
                gr.ColorPicker(value=rgb_to_hex(101, 0, 94), label="Background gradiant color", elem_id="nevyui_bgGradiantColor")
                gr.ColorPicker(value=rgb_to_hex(92, 175, 214), label="Accent color", elem_id="nevyui_accentColor")

            # footer
            gr.HTML(value="<div class='nevysha settings-nevyui-bottom'>"
                          "<p class='info'>Made by Nevysha with luv</p>"
                          "</div>")

    return [(ui, "Nevysha Comfy UI", "nevyui")]


def on_ui_settings():

    section = ('nevyui', "Nevysha Comfy UI")


    shared.opts.add_option("nevyui_menuPosition",
                           shared.OptionInfo(
                               default='top',
                               label="Main menu position",
                               component=gr.Radio,
                               component_args={"choices": ['left', 'top']},
                               section=section))

    shared.opts.add_option("nevyui_waveColor",
                           shared.OptionInfo(
                               default=rgb_to_hex(94, 26, 145),
                               label="Waves color",
                               component=gr.ColorPicker,
                               section=section))

    shared.opts.add_option("nevyui_bgGradiantColor",
                           shared.OptionInfo(
                               default=rgb_to_hex(101, 0, 94),
                               label="Background gradiant color",
                               component=gr.ColorPicker,
                               section=section))

    shared.opts.add_option("nevyui_accentColor",
                           shared.OptionInfo(
                               default=rgb_to_hex(92, 175, 214),
                               label="Accent color",
                               component=gr.ColorPicker,
                               section=section))

    shared.opts.add_option("nevyui_accentGenerateButton",
                           shared.OptionInfo(
                               default=False,
                               label="Accent Generate Button",
                               component=gr.Checkbox,
                               section=section))

    shared.opts.add_option("nevyui_fontSize",
                           shared.OptionInfo(
                               default=12,
                               label="Font size",
                               component=gr.Slider,
                               component_args={"maximum": 18, "minimum": 10, "step": 1},
                               section=section))


script_callbacks.on_ui_settings(on_ui_settings)
script_callbacks.on_ui_tabs(on_ui_tabs)
