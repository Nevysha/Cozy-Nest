import hashlib
import json
import os
import sys
import time

from PIL import Image

from modules import shared, scripts
from scripts.cozy_lib import Static
from scripts.cozy_lib.CozyLogger import CozyLoggerImageBrowser as Logger


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


def get_image_exif(path: str):
    try:
        image = Image.open(path)
        image.load()

        src_info = image.text or {}
        image.close()

        return src_info
    except:
        return {}


def calculate_sha256(file_path):
    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()

    # Open the file in binary mode
    with open(file_path, 'rb') as file:
        # Read the file in chunks to avoid loading the entire file into memory
        for chunk in iter(lambda: file.read(4096), b''):
            # Update the hash object with the current chunk
            sha256_hash.update(chunk)

    # Get the hexadecimal representation of the hash digest
    sha256_hex = sha256_hash.hexdigest()

    return sha256_hex


def get_exif(path):
    # info = image.info
    exif = get_image_exif(path)

    # get the image sha256 hash
    sha256_hex = calculate_sha256(path)

    img = {
        'path': path,
        'hash': sha256_hex,
        'metadata': {
            'date': os.path.getmtime(path),
            'exif': exif,
        }
    }
    return img


def update_img_data(path):
    # get the corresponding image in the cache, update its metadata and save it back to the cache in the same position
    with open(Static.CACHE_FILENAME, 'r') as f:
        cache = json.loads(f.read())
        for img in cache['images']:
            if img['path'] == path:
                exif = get_image_exif(path)
                img['metadata'] = {
                    'date': os.path.getmtime(path),
                    'exif': exif,
                }
                break
        with open(Static.CACHE_FILENAME, 'w') as fw:
            fw.write(json.dumps(cache, indent=4))


def delete_img_data(path):
    # get the corresponding image in the cache and remove it
    with open(Static.CACHE_FILENAME, 'r') as f:
        cache = json.loads(f.read())
        for img in cache['images']:
            if img['path'] == path:
                cache['images'].remove(img)
                break
        with open(Static.CACHE_FILENAME, 'w') as fw:
            fw.write(json.dumps(cache))


def delete_index():
    # delete the cache file
    if os.path.exists(Static.CACHE_FILENAME):
        os.remove(Static.CACHE_FILENAME)


def scrap_image_folders(images_folders):

    # if the cache file exists, read it and return the data
    if os.path.exists(Static.CACHE_FILENAME):
        with open(Static.CACHE_FILENAME, 'r') as f:
            return json.loads(f.read())

    # scrape the images folder recursively
    Logger.debug('Scraping images folders...')
    # TODO store images as hash=>data in index

    # gather all the images paths
    images_path = []
    for images_folder in images_folders:
        for root, dirs, files in os.walk(images_folder):
            for file in files:
                if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".jpeg"):
                    images_path.append(os.path.join(root, file))

    Logger.info(f"Creating images index for {len(images_path)} images...")

    # get the exif data for each image
    # TODO nevysha try to use multiprocessing
    images = []
    start_time = time.time()
    for i, path in enumerate(images_path):
        # get exif data
        img = get_exif(path)
        images.append(img)

        # Calculate progress and elapsed time
        elapsed_time = time.time() - start_time
        progress = (i + 1) / len(images_path)

        # Display progress bar with elapsed time and estimated time remaining
        # only each ten images or if it's the last image
        if i % 10 == 0:
            display_progress_bar(progress, elapsed_time)
        elif i == len(images_path) - 1:
            display_progress_bar(1, elapsed_time)

    # sort the images by date (newest first) metadata.date
    images.sort(key=lambda x: x['metadata']['date'], reverse=True)

    # send the images to the client
    data = {
        'what': 'images',
        'images': images
    }

    if not os.path.exists(Static.CACHE_FILENAME):
        open(Static.CACHE_FILENAME, 'w').close()

    with open(Static.CACHE_FILENAME, 'w') as f:
        f.write(json.dumps(data))

    return data


def new_image(_new_img_data):
    # Add the image to the cache
    with open(Static.CACHE_FILENAME, 'r') as fr:
        cache = json.loads(fr.read())
        cache['images'].insert(0, _new_img_data)
        with open(Static.CACHE_FILENAME, 'w') as fw:
            fw.write(json.dumps(cache))


def display_progress_bar(progress, elapsed_time):
    bar_length = 40
    filled_length = int(bar_length * progress)
    bar = '█' * filled_length + '-' * (bar_length - filled_length)
    percentage = progress * 100
    progress_bar = f'[Cozy:ImageBrowser:INFO] Indexing: |{bar}| {percentage:.1f}% Complete | Elapsed: {elapsed_time:.2f}s'
    sys.stdout.write('\r' + progress_bar)
    sys.stdout.flush()
