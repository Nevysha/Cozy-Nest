import glob
import json
import os
from pathlib import Path

from fastapi import Response, Request

from modules import sd_hijack, shared, sd_models
from scripts.CozyLogger import CozyLoggerClass

CozyLoggerExtNe = CozyLoggerClass("CozyLogger:ExtNe")


def format_path_array(paths, _type, validator):
    all_paths = []
    for path in paths:
        if validator(path):

            fullName = str(path.name)
            name = str(path.name)[:str(path.name).rfind('.')]

            previewPath = os.path.join(path.parent, str(name)) + ".preview.png"
            if not os.path.exists(previewPath):
                previewPath = None

            all_paths.append({
                "name": name,
                "fullName": fullName,
                "type": _type,
                "path": str(path),
                # preview path if it exists os.path.join(path.parent, str(path.name))}.preview.png
                "previewPath": previewPath
            })

    return sorted(all_paths, key=lambda x: x['name'].lower())


# gather extra network folders
# credit to https://github.com/DominikDoom/a1111-sd-webui-tagcomplete
class CozyExtraNetworksClass:
    def __init__(self, config):
        try:
            from modules.paths import extensions_dir, script_path
        except ImportError:
            extensions_dir = None
            script_path = None

        if extensions_dir is not None and script_path is not None:
            # Webui root path
            self.FILE_DIR = Path(script_path)

            # The extension base path
            self.EXT_PATH = Path(extensions_dir)
        else:
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

        # print all paths
        CozyLoggerExtNe.debug(f"FILE_DIR: {self.FILE_DIR}")
        CozyLoggerExtNe.debug(f"EXT_PATH: {self.EXT_PATH}")
        CozyLoggerExtNe.debug(f"EMB_PATH: {self.EMB_PATH}")
        CozyLoggerExtNe.debug(f"HYP_PATH: {self.HYP_PATH}")
        CozyLoggerExtNe.debug(f"LORA_PATH: {self.LORA_PATH}")
        CozyLoggerExtNe.debug(f"LYCO_PATH: {self.LYCO_PATH}")
        CozyLoggerExtNe.debug(f"MODEL_PATH: {self.MODEL_PATH}")

    def get_hypernetworks(self):
        """Write a list of all hypernetworks"""

        # Get a list of all hypernetworks in the folder
        hyp_paths = [Path(h) for h in glob.glob(self.HYP_PATH.joinpath("**/*").as_posix(), recursive=True)]

        return format_path_array(hyp_paths, 'hypernet', lambda x: x.suffix in {".pt"})

    def get_lora(self):
        """Write a list of all lora"""

        # Get a list of all lora in the folder
        lora_paths = [Path(lo) for lo in glob.glob(self.LORA_PATH.joinpath("**/*").as_posix(), recursive=True)]

        return format_path_array(lora_paths, 'lora', lambda x: x.suffix in {".safetensors", ".ckpt", ".pt"})

    def get_lyco(self):
        """Write a list of all LyCORIS/LOHA from https://github.com/KohakuBlueleaf/a1111-sd-webui-lycoris"""

        # Get a list of all LyCORIS in the folder
        lyco_paths = [Path(ly) for ly in glob.glob(self.LYCO_PATH.joinpath("**/*").as_posix(), recursive=True)]

        return format_path_array(lyco_paths, 'lyco', lambda x: x.suffix in {".safetensors", ".ckpt", ".pt"})

    def get_models(self):
        models_paths = [Path(m) for m in glob.glob(self.MODEL_PATH.joinpath("**/*").as_posix(), recursive=True)]
        # all_models = [str(m.name) for m in models_paths if m.suffix in {".ckpt", ".safetensors"}]
        return format_path_array(models_paths, 'ckp', lambda x: x.suffix in {".ckpt", ".safetensors"})

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

            for e in emb_v1:
                results.append({
                    "name": e,
                    "version": "v1",
                    "type": "ti",
                    "path": os.path.join(self.EMB_PATH, e + ".pt"),
                    "parentFolder": os.path.join(self.EMB_PATH, e)
                })

            for e in emb_v2:
                results.append({
                    "name": e,
                    "type": "ti",
                    "path": os.path.join(self.EMB_PATH, e + ".pt"),
                    "parentFolder": os.path.join(self.EMB_PATH, e)
                })

            results = sorted(results, key=lambda x: x["name"].lower())
        except AttributeError:
            print(
                "tag_autocomplete_helper: Old webui version or unrecognized model shape, using fallback for embedding completion.")
            # Get a list of all embeddings in the folder
            all_embeds = [str(e.relative_to(self.EMB_PATH)) for e in self.EMB_PATH.rglob("*") if
                          e.suffix in {".bin", ".pt", ".png", '.webp', '.jxl', '.avif'}]
            # Remove files with a size of 0
            all_embeds = [e for e in all_embeds if self.EMB_PATH.joinpath(e).stat().st_size > 0]
            # Remove file extensions
            all_embeds = [e[:e.rfind('.')] for e in all_embeds]
            results = [e + "," for e in all_embeds]

        return results

    # def search_for_civitai(self):
    #     extensions_path = Path(os.path.join(self.FILE_DIR, "extensions"))
    #
    #     # get through all folder. inside, get the "scripts" folder and look for "civitai_helper.py"
    #     for folder in extensions_path.iterdir():
    #         if folder.is_dir():
    #             scripts_folder = folder.joinpath("scripts")
    #             if scripts_folder.exists():
    #                 civitai_helper = scripts_folder.joinpath("civitai_helper.py")
    #                 if civitai_helper.exists():
    #                     return True

    def create_api_route(self, app):
        @app.get("/cozy-nest/valid_extra_networks")
        def valid_extra_networks():
            valid = {}
            if self.MODEL_PATH is not None:
                valid["MODEL_PATH"] = self.MODEL_PATH

            if self.EMB_PATH is not None:
                valid["EMB_PATH"] = self.EMB_PATH

            if self.HYP_PATH is not None:
                valid["HYP_PATH"] = self.HYP_PATH

            if self.LORA_PATH is not None:
                valid["LORA_PATH"] = self.LORA_PATH

            if self.LYCO_PATH is not None:
                valid["LYCO_PATH"] = self.LYCO_PATH

            return valid

        @app.get("/cozy-nest/extra_networks")
        def extra_networks():
            # get all extra networks by walking through all directories recursively

            result = {}

            if self.MODEL_PATH is not None:
                model = self.get_models()
                result["models"] = model

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

            return result

        @app.get("/cozy-nest/extra_networks/full")
        def extra_networks():
            # get all extra networks by walking through all directories recursively

            result = {}

            if self.MODEL_PATH is not None:
                model = self.get_models()

                # for each model, get the info
                for m in model:
                    try:
                        info = get_info(m["path"])
                        m["info"] = info
                    except InfoUnavailableException:
                        m["info"] = {
                            "empty": True
                        }

                result["models"] = model

            if self.EMB_PATH is not None:
                emb = self.get_embeddings()

                # for each embedding, get the info
                for e in emb:
                    try:
                        info = get_info(e["path"])
                        e["info"] = info
                    except InfoUnavailableException:
                        e["info"] = {
                            "empty": True
                        }

                result["embeddings"] = emb

            if self.HYP_PATH is not None:
                hyp = self.get_hypernetworks()

                # for each hypernetwork, get the info
                for h in hyp:
                    try:
                        info = get_info(h["path"])
                        h["info"] = info
                    except InfoUnavailableException:
                        h["info"] = {
                            "empty": True
                        }

                result["hypernetworks"] = hyp

            if self.LORA_PATH is not None:
                lora = self.get_lora()

                # for each lora, get the info
                for l in lora:
                    try:
                        info = get_info(l["path"])
                        l["info"] = info
                    except InfoUnavailableException:
                        l["info"] = {
                            "empty": True
                        }

                result["lora"] = lora

            if self.LYCO_PATH is not None:
                lyco = self.get_lyco()

                # for each lyco, get the info
                for ly in lyco:
                    try:
                        info = get_info(ly["path"])
                        ly["info"] = info
                    except InfoUnavailableException:
                        ly["info"] = {
                            "empty": True
                        }

                result["lyco"] = lyco

            return result

        @app.get("/cozy-nest/extra_network/")
        def extra_network(path: str):
            try:
                info = get_info(path)
                return info
            except InfoUnavailableException as e:
                return Response(status_code=e.code, content=e.message)

        @app.post("/cozy-nest/extra_network/toggle-nsfw")
        async def extra_network_info(request: Request):
            try:
                request_json = await request.json()
                path = request_json["path"]
            except Exception as e:
                return Response(status_code=405, content="Invalid request body")

            if path is None:
                return Response(status_code=405, content="Invalid request body")

            try:
                info = get_info(path)
            except InfoUnavailableException as e:
                info = {}
                info_file = get_civitai_info_path(path)
                with open(info_file, 'w') as f:
                    json.dump(info, f)

            # nsfw data is there : info.model.nsfw. change the value to false or true and create each layer if it does not exist
            if "model" not in info or "nsfw" not in info["model"]:
                if "model" not in info:
                    info["model"] = {}
                if "nsfw" not in info["model"]:
                    info["model"]["nsfw"] = False
            else:
                info["model"]["nsfw"] = not info["model"]["nsfw"]

            # save the info
            info_file = get_civitai_info_path(path)
            with open(info_file, 'w') as f:
                json.dump(info, f)

            return info


class InfoUnavailableException(Exception):
    # add a code attribute to the exception
    def __init__(self, message, code):
        super().__init__(message)
        self.message = message
        self.code = code


def get_info(path: str):
    path = get_civitai_info_path(path)
    if not path.exists():
        raise InfoUnavailableException("Info file not found", 404)

    with open(path, 'r') as f:
        try:
            info = json.load(f)
        except Exception:
            raise InfoUnavailableException("Could not read info file", 500)

        return info


def get_civitai_info_path(path):
    return Path(path[:path.rfind('.')] + '.civitai.info')
