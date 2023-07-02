import json
import os

from modules import shared
from scripts.tools import output_folder_array

EXTENSION_FOLDER_NAME = os.path.basename(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CONFIG_FILENAME = f"extensions/{EXTENSION_FOLDER_NAME}/nevyui_settings.json"
CONFIG_FILENAME = os.path.join(shared.cmd_opts.data_dir, CONFIG_FILENAME)


class CozyNestConfig:
    def __init__(self):
        config = self.get_dict_from_config()
        self.config = {**CozyNestConfig.get_default_settings(), **config}

    def init(self):
        if self.config['webui'] == 'unknown' and hasattr(shared, 'get_version'):
            version = shared.get_version()
            # check if the 'app' is 'sd.next'
            if version['app'] == 'sd.next':
                self.config['webui'] = 'sd.next'
                self.config['fetch_output_folder_from_a1111_settings'] = False
            else:
                self.config['webui'] = 'auto1111'
            self.save_settings(self.config)

        if self.config['webui'] == 'sd.next':
            self.config['fetch_output_folder_from_a1111_settings'] = False

        # check if cnib_output_folder is empty and/or need to be fetched from a1111 settings
        cnib_output_folder = self.config.get('cnib_output_folder')
        is_empty = cnib_output_folder == []
        if not cnib_output_folder or is_empty:
            cnib_output_folder = []

        if self.config.get('fetch_output_folder_from_a1111_settings'):
            # merge cnib_output_folder output_folder_array()
            cnib_output_folder = cnib_output_folder + list(set(output_folder_array()) - set(cnib_output_folder))

        self.config['cnib_output_folder'] = cnib_output_folder

        # save the merged settings
        self.save_settings(self.config)

    def get(self, key):
        return self.config.get(key)

    def simple_save_settings(self):
        # create the file in extensions/Cozy-Nest if it doesn't exist
        if not os.path.exists(CONFIG_FILENAME):
            open(CONFIG_FILENAME, 'w').close()
        # save each settings inside the file
        with open(CONFIG_FILENAME, 'w') as f:
            f.write(json.dumps(self.config, indent=2))
            f.close()

    def save_settings(self, settings):
        self.config = {
            # always ensure that default settings for cross version compatibility
            **CozyNestConfig.get_default_settings(),
            **self.config,
            **settings
        }
        self.simple_save_settings()

    def get_dict_from_config(self):
        if not os.path.exists(CONFIG_FILENAME):
            self.reset_settings()
            # return default config
            return self.get_default_settings()

        with open(CONFIG_FILENAME, 'r') as f:
            config = json.loads(f.read())
            f.close()
            return config

    def reset_settings(self):
        self.config = CozyNestConfig.get_default_settings()
        self.simple_save_settings()

    @staticmethod
    def get_default_settings():
        return {
            'main_menu_position': 'top',
            'accent_generate_button': True,
            'font_size': 12,
            'quicksettings_position': 'split',
            'font_color': '#d4d4d4',
            'font_color_light': rgb_to_hex(71, 71, 71),
            'waves_color': rgb_to_hex(94, 26, 145),
            'bg_gradiant_color': rgb_to_hex(101, 0, 94),
            'accent_color': '#37b9dd',
            'secondary_accent_color': '#b67ee1',
            'card_height': '8',
            'card_width': '16',
            'error_popup': True,
            'disable_image_browser': True,
            'disable_waves_and_gradiant': False,
            'server_default_port': 3333,
            'auto_search_port': True,
            'auto_start_server': True,
            'fetch_output_folder_from_a1111_settings': False,
            'cnib_output_folder': [],
            'archive_path': '',
            'sfw_mode': False,
            'enable_clear_button': True,
            'enable_extra_network_tweaks': True,
            'enable_cozy_prompt': True,
            'carret_style': 'thin',
            'save_last_prompt_local_storage': True,
            'color_mode': 'dark',
            'log_enabled': False,
            'webui': 'unknown'
        }


def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)


def hex_to_rgb(_hex):
    rgb = []
    for i in (0, 2, 4):
        decimal = int(_hex[i:i + 2], 16)
        rgb.append(decimal)

    return tuple(rgb)
