import os
from pathlib import Path

from modules import shared, scripts

EXTENSION_FOLDER = Path(__file__).parent.parent.parent
CONFIG_FILENAME = Path(EXTENSION_FOLDER, "nevyui_settings.json")
VERSION_FILENAME = Path(EXTENSION_FOLDER, "version_data.json")
CACHE_FILENAME = Path(EXTENSION_FOLDER, "data", "images.cache")


def output_folder_array():
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
    return images_folders
