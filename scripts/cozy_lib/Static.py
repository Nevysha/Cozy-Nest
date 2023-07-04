from pathlib import Path

EXTENSION_FOLDER = Path(__file__).parent.parent.parent
CONFIG_FILENAME = Path(EXTENSION_FOLDER, "nevyui_settings.json")
VERSION_FILENAME = Path(EXTENSION_FOLDER, "version_data.json")
CACHE_FILENAME = Path(EXTENSION_FOLDER, "data", "images.cache")
