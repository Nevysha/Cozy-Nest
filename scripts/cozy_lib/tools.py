import hashlib
import json
import os
import sys
import threading
import time

from PIL import Image

from modules import shared, scripts
from scripts.cozy_lib import Static
from scripts.cozy_lib.CozyLogger import CozyLoggerImageBrowser as Logger


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
    # TODO NEVYSHA store images as hash=>data in index

    # gather all the images paths
    images_path = []
    for images_folder in images_folders:
        for root, dirs, files in os.walk(images_folder):
            for file in files:
                if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".jpeg"):
                    images_path.append(os.path.join(root, file))

    Logger.info(f"Creating images index for {len(images_path)} images...")

    # get the exif data for each image

    # split the images_path list into chunks and process each chunk in a separate thread
    thread_count = os.cpu_count()
    Logger.debug(f"Using {thread_count} threads to process the images...")
    split_count = (len(images_path) + 1) // thread_count
    splited = [images_path[i * split_count:(i + 1) * split_count] for i in range(thread_count)]

    images = []
    start_time = time.time()

    def process_chunk(_chunk):
        for i, path in enumerate(_chunk):
            # get exif data
            img = get_exif(path)
            images.append(img)

    # create a thread for each chunk
    threads = []
    for chunk in splited:
        t = threading.Thread(target=process_chunk, args=(chunk,))
        t.start()
        threads.append(t)

    # wait for all the threads to finish
    # loop to check if the threads are done
    while True:
        elapsed_time = time.time() - start_time
        if not any([t.is_alive() for t in threads]):
            display_progress_bar(1, elapsed_time)
            break

        # Calculate progress and elapsed time
        i = len(images)
        progress = (i + 1) / len(images_path)

        # Display progress bar with elapsed time and estimated time remaining
        # only each ten images or if it's the last image
        if i == len(images_path) - 1:
            display_progress_bar(1, elapsed_time)
        else:
            display_progress_bar(progress, elapsed_time)

        time.sleep(0.1)

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
