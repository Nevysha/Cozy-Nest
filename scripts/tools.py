import hashlib
import json
import os

from PIL import Image


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
        'metadata': {
            'hash': sha256_hex,
            'date': os.path.getmtime(path),
            'exif': exif,
        }
    }
    return img


def update_img_data(path):
    # get the corresponding image in the cache, update its metadata and save it back to the cache in the same position
    with open(CACHE_FILENAME, 'r') as f:
        cache = json.loads(f.read())
        for img in cache['images']:
            if img['path'] == path:
                exif = get_image_exif(path)
                img['metadata'] = {
                    'hash': img['metadata']['hash'],
                    'date': os.path.getmtime(path),
                    'exif': exif,
                }
                break
        with open(CACHE_FILENAME, 'w') as fw:
            fw.write(json.dumps(cache))


def delete_img_data(path):
    # get the corresponding image in the cache and remove it
    with open(CACHE_FILENAME, 'r') as f:
        cache = json.loads(f.read())
        for img in cache['images']:
            if img['path'] == path:
                cache['images'].remove(img)
                break
        with open(CACHE_FILENAME, 'w') as fw:
            fw.write(json.dumps(cache))


def delete_index():
    # delete the cache file
    if os.path.exists(CACHE_FILENAME):
        os.remove(CACHE_FILENAME)


EXTENSION_TECHNICAL_NAME = os.path.basename(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# TODO use db instead of cache file
CACHE_FILENAME = f"extensions/{EXTENSION_TECHNICAL_NAME}/data/images.cache"


def scrap_image_folders(images_folders):

    # if the cache file exists, read it and return the data
    if os.path.exists(CACHE_FILENAME):
        with open(CACHE_FILENAME, 'r') as f:
            return json.loads(f.read())

    # scrape the images folder recursively
    # TODO store images as hash=>data in index
    images = []
    for images_folder in images_folders:
        for root, dirs, files in os.walk(images_folder):
            for file in files:
                if file.endswith(".png"):
                    # get exif data
                    img = get_exif(os.path.join(root, file))
                    images.append(img)

    # sort the images by date (newest first) metadata.date
    images.sort(key=lambda x: x['metadata']['date'], reverse=True)

    # send the images to the client
    data = {
        'what': 'images',
        'images': images
    }

    if not os.path.exists(CACHE_FILENAME):
        open(CACHE_FILENAME, 'w').close()

    with open(CACHE_FILENAME, 'w') as f:
        f.write(json.dumps(data))

    return data


def new_image(data):
    # Add the image to the cache
    with open(CACHE_FILENAME, 'r') as f:
        cache = json.loads(f.read())
        cache['images'].insert(0, data)
        with open(CACHE_FILENAME, 'w') as f:
            f.write(json.dumps(cache))
