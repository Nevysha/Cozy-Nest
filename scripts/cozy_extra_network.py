from pathlib import Path
from modules import script_callbacks, scripts, sd_hijack, shared, sd_models
from scripts.CozyLogger import CozyLoggerClass


# gather extra network folders
# credit to https://github.com/DominikDoom/a1111-sd-webui-tagcomplete
class CozyExtraNetworksClass:
    def __init__(self, config):
        try:
            from modules.paths import extensions_dir, script_path

            # Webui root path
            self.FILE_DIR = Path(script_path)

            # The extension base path
            self.EXT_PATH = Path(extensions_dir)
        except ImportError:
            # Webui root path
            self.FILE_DIR = Path().absolute()
            # The extension base path
            self.EXT_PATH = self.FILE_DIR.joinpath('extensions')

        self.EMB_PATH = Path(shared.cmd_opts.embeddings_dir)
        self.HYP_PATH = Path(shared.cmd_opts.hypernetwork_dir)

        try:
            self.LORA_PATH = Path(shared.cmd_opts.lora_dir)
        except AttributeError:
            self.LORA_PATH = None

        try:
            self.LYCO_PATH = Path(shared.cmd_opts.lyco_dir)
        except AttributeError:
            self.LYCO_PATH = None

        try:
            ckpt_dir = shared.cmd_opts.ckpt_dir or sd_models.model_path
            self.MODEL_PATH = Path(ckpt_dir)
        except AttributeError or TypeError:
            self.MODEL_PATH = None

        CozyLogger = CozyLoggerClass("CozyLogger", config)

        # print all paths
        CozyLogger.debug(f"FILE_DIR: {self.FILE_DIR}")
        CozyLogger.debug(f"EXT_PATH: {self.EXT_PATH}")
        CozyLogger.debug(f"EMB_PATH: {self.EMB_PATH}")
        CozyLogger.debug(f"HYP_PATH: {self.HYP_PATH}")
        CozyLogger.debug(f"LORA_PATH: {self.LORA_PATH}")
        CozyLogger.debug(f"LYCO_PATH: {self.LYCO_PATH}")
        CozyLogger.debug(f"MODEL_PATH: {self.MODEL_PATH}")

    def create_api_route(self, app):
        @app.get("/cozy-nest/valid_extra_networks")
        def valid_extra_networks():
            valid = {}
            if self.MODEL_PATH is None:
                valid["MODEL_PATH"] = False
            else:
                valid["MODEL_PATH"] = self.MODEL_PATH

            if self.EMB_PATH is None:
                valid["EMB_PATH"] = False
            else:
                valid["EMB_PATH"] = self.EMB_PATH

            if self.HYP_PATH is None:
                valid["HYP_PATH"] = False
            else:
                valid["HYP_PATH"] = self.HYP_PATH

            if self.LORA_PATH is None:
                valid["LORA_PATH"] = False
            else:
                valid["LORA_PATH"] = self.LORA_PATH

            if self.LYCO_PATH is None:
                valid["LYCO_PATH"] = False
            else:
                valid["LYCO_PATH"] = self.LYCO_PATH

            return valid
