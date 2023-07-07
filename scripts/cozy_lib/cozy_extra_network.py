import glob
import json
import os
import shutil
from pathlib import Path

from fastapi import Response, Request

from modules import sd_hijack, shared, sd_models
from scripts.cozy_lib.CozyLogger import CozyLoggerExtNe
from scripts.cozy_lib.CozyNestConfig import CozyNestConfig


def format_path_array(paths, _type, validator):
    all_paths = []
    for path in paths:
        if validator(path):

            fullName = str(path.name)
            name = str(path.name)[:str(path.name).rfind('.')]

            previewPath = get_preview_path(path)

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
    def __init__(self):
        self.MODEL_PATH = None
        self.LYCO_PATH = None
        self.LORA_PATH = None
        self.HYP_PATH = None
        self.EMB_PATH = None
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

        config = CozyNestConfig.instance()
        if config.is_auto1111():
            self.init_for_a1111()
        else:
            self.init_for_sdnext()

        # print all paths
        CozyLoggerExtNe.debug(f"FILE_DIR: {self.FILE_DIR}")
        CozyLoggerExtNe.debug(f"EXT_PATH: {self.EXT_PATH}")
        CozyLoggerExtNe.debug(f"EMB_PATH: {self.EMB_PATH}")
        CozyLoggerExtNe.debug(f"HYP_PATH: {self.HYP_PATH}")
        CozyLoggerExtNe.debug(f"LORA_PATH: {self.LORA_PATH}")
        CozyLoggerExtNe.debug(f"LYCO_PATH: {self.LYCO_PATH}")
        CozyLoggerExtNe.debug(f"MODEL_PATH: {self.MODEL_PATH}")

    def init_for_a1111(self):
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

    def init_for_sdnext(self):
        # TODO NEVYSHA implement sd next compliant
        self.init_for_a1111()

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
                emb_path = os.path.join(self.EMB_PATH, e)
                previewPath = get_preview_path(Path(emb_path))

                results.append({
                    "name": e,
                    "version": "v1",
                    "type": "ti",
                    "path": f"{emb_path}.pt",
                    "previewPath": previewPath,
                    "parentFolder": os.path.join(self.EMB_PATH, e)
                })

            for e in emb_v2:
                emb_path = os.path.join(self.EMB_PATH, e)
                previewPath = get_preview_path(Path(emb_path))
                results.append({
                    "name": e,
                    "version": "v2",
                    "type": "ti",
                    "path": f"{emb_path}.pt",
                    "previewPath": previewPath,
                    "parentFolder": os.path.join(self.EMB_PATH, e)
                })

            results = sorted(results, key=lambda x: x["name"].lower())
        except AttributeError:
            CozyLoggerExtNe.warning(
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

        @app.get("/cozy-nest/extra_networks/folders")
        def extra_networks_folder():

            folder_tree = {}

            if self.MODEL_PATH is not None:
                models = self.get_models()
                folder_tree['models'] = build_main_folder_tree_for(self.MODEL_PATH, models)

            if self.EMB_PATH is not None:
                emb = self.get_embeddings()
                folder_tree['embeddings'] = build_main_folder_tree_for(self.EMB_PATH, emb)

            if self.HYP_PATH is not None:
                hyp = self.get_hypernetworks()
                folder_tree['hypernetworks'] = build_main_folder_tree_for(self.HYP_PATH, hyp)

            if self.LORA_PATH is not None:
                lora = self.get_lora()
                folder_tree['lora'] = build_main_folder_tree_for(self.LORA_PATH, lora)

            if self.LYCO_PATH is not None:
                lyco = self.get_lyco()
                folder_tree['lyco'] = build_main_folder_tree_for(self.LYCO_PATH, lyco)

            return folder_tree

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
                for lo in lora:
                    try:
                        info = get_info(lo["path"])
                        lo["info"] = info
                    except InfoUnavailableException:
                        lo["info"] = {
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

        @app.post("/cozy-nest/extra_network/preview")
        async def extra_network_preview(request: Request):
            # path and file are in body as FormData
            try:
                form = await request.form()
                path = form["path"]
                upload_file = form["file"]
            except Exception:
                return Response(status_code=405, content="Invalid request body")
            if path is None or upload_file is None:
                return Response(status_code=405, content="Invalid request body")

            try:
                file_type = upload_file.content_type[upload_file.content_type.rfind("/") + 1:]
                valid = ["png", "jpg", "jpeg", "webp"]
                if file_type not in valid:
                    return Response(status_code=405, content="Invalid file type")

                path = Path(f"{str(path)[:str(path).rfind('.')]}.preview.{file_type}")
                # save the file
                with open(path, "wb") as buffer:
                    shutil.copyfileobj(upload_file.file, buffer)

            except Exception as e:
                print(e)
                return Response(status_code=500, content="Failed to create file")

            return Response(status_code=200, content=json.dumps({
                "previewPath": f"{path}"
            }))

        @app.post("/cozy-nest/extra_network/toggle-nsfw")
        async def extra_network_info(request: Request):
            try:
                request_json = await request.json()
                path = request_json["path"]
            except Exception:
                return Response(status_code=405, content="Invalid request body")

            if path is None:
                return Response(status_code=405, content="Invalid request body")

            try:
                info = get_info(path)
            except InfoUnavailableException:
                info = {}
                info_file = get_civitai_info_path(path)
                with open(info_file, 'w') as f:
                    json.dump(info, f)

            # nsfw data is there : info.model.nsfw. change the value to false or true
            # and create each layer if it does not exist
            if "model" not in info or "nsfw" not in info["model"]:
                if "model" not in info:
                    info["model"] = {}
                if "nsfw" not in info["model"]:
                    # since default is considered false set it to true
                    info["model"]["nsfw"] = True
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


def build_main_folder_tree_for(_main_path, main_items):
    # walk through all models and build the folder tree structure from self.MODEL_PATH downwards
    models_folder_tree = {
        "name": "all",
        "empty": True,
        "children": []
    }
    for m in main_items:
        # split the path into its parts
        rel_path = Path(m["path"]).relative_to(_main_path)
        path_parts = str(rel_path).split(os.sep)
        if len(path_parts) == 1:
            # if the model is in the root folder, skip it
            continue

        models_folder_tree["empty"] = False

        # remove the last part, which is the filename
        path_parts.pop(-1)

        # get the folder tree
        models_folder_tree = add_folder_to_tree(_main_path, models_folder_tree, path_parts)
    return sort_folder_tree(models_folder_tree)


def add_folder_to_tree(full_path_to_leaf, folder_tree, path_parts):
    # if there are no more parts, we are done
    if len(path_parts) == 0:
        return folder_tree

    # get the first part of the path
    part = path_parts.pop(0)
    full_path_to_leaf = Path(full_path_to_leaf, part)

    # check if the part is already in the folder tree
    for child in folder_tree["children"]:
        if child["name"] == part:
            # if it is, add the rest of the path to the child
            add_folder_to_tree(full_path_to_leaf, child, path_parts)
            return folder_tree

    # if the part is not in the folder tree, add it
    folder_tree["children"].append({
        "name": part,
        "metadata": {
            "path": str(full_path_to_leaf),
        },
        "children": [],
    })

    # add the rest of the path to the new child
    add_folder_to_tree(full_path_to_leaf, folder_tree["children"][-1], path_parts)

    return folder_tree


def sort_folder_tree(folder_tree):
    # sort the folder tree alphabetically
    folder_tree["children"] = sorted(folder_tree["children"], key=lambda x: str(x["name"]).lower())

    # sort the children of each child
    for child in folder_tree["children"]:
        sort_folder_tree(child)

    return folder_tree


def get_preview_path(path: Path):
    directory = path.parent
    # check if path end with an extension and remove it
    if path.name.rfind('.') != -1:
        base_name = path.name[:path.name.rfind('.')]
    else:
        base_name = path.name

    extensions = ['.png', '.jpg', '.jpeg', '.webp']
    files = []
    for ext in extensions:
        preview_candidate = Path(directory, f"{base_name}.preview{ext}")
        if preview_candidate.exists():
            files.append(preview_candidate)

    if not files or len(files) == 0:
        return None

    sorted_files = sorted(files, key=os.path.getmtime, reverse=True)
    return Path(sorted_files[0])
