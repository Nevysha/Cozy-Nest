
import gradio as gr
import os

from modules import scripts, script_callbacks, shared, sd_hijack


def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)


def hex_to_rgb(hex):
    rgb = []
    for i in (0, 2, 4):
        decimal = int(hex[i:i+2], 16)
        rgb.append(decimal)

    return tuple(rgb)


def on_ui_settings():

    section = ('nevyui', "Nevysha Comfy UI")


    shared.opts.add_option("nevyui_menuPosition",
                           shared.OptionInfo(
                               default='left',
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


script_callbacks.on_ui_settings(on_ui_settings)