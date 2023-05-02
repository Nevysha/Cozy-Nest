
import gradio as gr
import os

from modules import scripts, script_callbacks, shared, sd_hijack

def on_ui_settings():

    section = ('nevyui', "Nevysha Comfy UI")


    shared.opts.add_option("nevyui_menuPosition",
                           shared.OptionInfo(
                               default='left',
                               label="Main menu position",
                               component=gr.Radio,
                               component_args={"choices": ['left', 'top']},
                               section=section))

    shared.opts.add_option("nevyui_enableWaves",
                           shared.OptionInfo(
                               default=True,
                               label="Enable waves",
                               component=gr.Checkbox,
                               section=section))

    shared.opts.add_option("nevyui_waveColor",
                           shared.OptionInfo(
                               default='rgb(94 26 145 / 16%)',
                               label="Waves color",
                               component=gr.Textbox,
                               section=section))

    shared.opts.add_option("nevyui_enableBgGradiant",
                           shared.OptionInfo(
                               default=True,
                               label="Enable background gradiant",
                               component=gr.Checkbox,
                               section=section))

    shared.opts.add_option("nevyui_bgGradiantColor",
                           shared.OptionInfo(
                               default='rgba(101,0,94,1)',
                               label="Background gradiant color",
                               component=gr.Textbox,
                               section=section))


script_callbacks.on_ui_settings(on_ui_settings)