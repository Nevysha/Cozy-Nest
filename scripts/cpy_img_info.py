import sys
import argparse
from PIL import Image
from PIL.PngImagePlugin import PngInfo

def copy_metadata(src_img, tgt_img):
    try:
        src_image = Image.open(src_img)
        src_info = src_image.text
    except Exception as e:
        print(f"Error reading metadata from {src_img}: {e}")
        return

    try:
        tgt_image = Image.open(tgt_img)
    except Exception as e:
        print(f"Error opening target image {tgt_img}: {e}")
        return

    tgt_info = PngInfo()

    for k, v in src_info.items():
        tgt_info.add_text(k, v)

    try:
        tgt_image.save(tgt_img, format=tgt_image.format, pnginfo=tgt_info)
        print(f"Metadata successfully copied from {src_img} to {tgt_img}")
    except Exception as e:
        print(f"Error writing metadata to {tgt_img}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Copy metadata from one PNG image to another.")
    parser.add_argument("--metadata-source", required=True, help="Source image with metadata")
    parser.add_argument("--metadata-target", required=True, help="Target image to copy metadata to")
    args = parser.parse_args()

    copy_metadata(args.metadata_source, args.metadata_target)

if __name__ == "__main__":
    main()