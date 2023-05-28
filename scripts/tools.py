from PIL import Image


def get_image_exif(path: str):
    try:
        image = Image.open(path)
        image.load()

        src_info = image.text or {}
        image.close()

        return src_info
    except:
        print(f"CozyNestSocket: WARNING cannot get exif data for image {path}")
        return {}
