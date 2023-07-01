import glob
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

    def get_hypernetworks(self):
        """Write a list of all hypernetworks"""

        # Get a list of all hypernetworks in the folder
        hyp_paths = [Path(h) for h in glob.glob(self.HYP_PATH.joinpath("**/*").as_posix(), recursive=True)]
        all_hypernetworks = [str(h.name) for h in hyp_paths if h.suffix in {".pt"}]
        # Remove file extensions
        return sorted([h[:h.rfind('.')] for h in all_hypernetworks], key=lambda x: x.lower())

    def get_lora(self):
        """Write a list of all lora"""

        # Get a list of all lora in the folder
        lora_paths = [Path(l) for l in glob.glob(self.LORA_PATH.joinpath("**/*").as_posix(), recursive=True)]
        all_lora = [str(l.name) for l in lora_paths if l.suffix in {".safetensors", ".ckpt", ".pt"}]
        # Remove file extensions
        return sorted([l[:l.rfind('.')] for l in all_lora], key=lambda x: x.lower())

    def get_lyco(self):
        """Write a list of all LyCORIS/LOHA from https://github.com/KohakuBlueleaf/a1111-sd-webui-lycoris"""

        # Get a list of all LyCORIS in the folder
        lyco_paths = [Path(ly) for ly in glob.glob(self.LYCO_PATH.joinpath("**/*").as_posix(), recursive=True)]
        all_lyco = [str(ly.name) for ly in lyco_paths if ly.suffix in {".safetensors", ".ckpt", ".pt"}]
        # Remove file extensions
        return sorted([ly[:ly.rfind('.')] for ly in all_lyco], key=lambda x: x.lower())

    def get_models(self):
        models_paths = [Path(m) for m in glob.glob(self.MODEL_PATH.joinpath("**/*").as_posix(), recursive=True)]
        all_models = [str(m.name) for m in models_paths if m.suffix in {".ckpt", ".safetensors"}]
        # Remove file extensions
        return sorted(all_models, key=lambda x: x.lower())

    def get_embeddings(self):
        """Write a list of all embeddings with their version"""

        # Version constants
        V1_SHAPE = 768
        V2_SHAPE = 1024
        emb_v1 = []
        emb_v2 = []
        results = []

        try:
            # Get embedding dict from sd_hijack to separate v1/v2 embeddings
            emb_type_a = sd_hijack.model_hijack.embedding_db.word_embeddings
            emb_type_b = sd_hijack.model_hijack.embedding_db.skipped_embeddings
            # Get the shape of the first item in the dict
            emb_a_shape = -1
            emb_b_shape = -1
            if len(emb_type_a) > 0:
                emb_a_shape = next(iter(emb_type_a.items()))[1].shape
            if len(emb_type_b) > 0:
                emb_b_shape = next(iter(emb_type_b.items()))[1].shape

            # Add embeddings to the correct list
            if emb_a_shape == V1_SHAPE:
                emb_v1 = list(emb_type_a.keys())
            elif emb_a_shape == V2_SHAPE:
                emb_v2 = list(emb_type_a.keys())

            if emb_b_shape == V1_SHAPE:
                emb_v1 = list(emb_type_b.keys())
            elif emb_b_shape == V2_SHAPE:
                emb_v2 = list(emb_type_b.keys())

            results = sorted([e + ",v1" for e in emb_v1] + [e + ",v2" for e in emb_v2], key=lambda x: x.lower())
        except AttributeError:
            print("tag_autocomplete_helper: Old webui version or unrecognized model shape, using fallback for embedding completion.")
            # Get a list of all embeddings in the folder
            all_embeds = [str(e.relative_to(self.EMB_PATH)) for e in self.EMB_PATH.rglob("*") if e.suffix in {".bin", ".pt", ".png",'.webp', '.jxl', '.avif'}]
            # Remove files with a size of 0
            all_embeds = [e for e in all_embeds if self.EMB_PATH.joinpath(e).stat().st_size > 0]
            # Remove file extensions
            all_embeds = [e[:e.rfind('.')] for e in all_embeds]
            results = [e + "," for e in all_embeds]

        return results

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

        @app.get("/cozy-nest/extra_networks")
        def extra_networks():
            # get all extra networks by walking through all directories recursively

            result = {}

            # Get a list of all embeddings in the folder
            if self.EMB_PATH is not None:
                emb = self.get_embeddings()
                result["embeddings"] = emb

            if self.HYP_PATH is not None:
                hyp = self.get_hypernetworks()
                result["hypernetworks"] = hyp

            if self.LORA_PATH is not None:
                lora = self.get_lora()
                result["lora"] = lora

            if self.LYCO_PATH is not None:
                lyco = self.get_lyco()
                result["lyco"] = lyco

            if self.MODEL_PATH is not None:
                model = self.get_models()
                result["models"] = model

            return result



