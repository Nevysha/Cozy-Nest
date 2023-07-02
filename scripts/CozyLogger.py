import json
import os
from pathlib import Path


def is_log_enabled():
    # check if the file log_enabled exists (in the same folder)
    # if it does, then check log_enabled value (as json)
    try:
        log_config_file = Path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'log_enabled'))
        if log_config_file.is_file():
            return True
    except Exception:
        return False


# This is a simple logger class that will be used to log messages stdout
# check the config if log is enabled
class CozyLoggerClass:

    LOG_ENABLED = is_log_enabled()

    def __init__(self, name: str):
        self.name = name
        self.log_enabled = CozyLoggerClass.LOG_ENABLED

    def debug(self, message: str):
        if self.log_enabled:
            print(f"[{self.name}:DEBUG] {message}")

    def warning(self, message: str):
        print(f"[{self.name}:WARNING] {message}")

    def info(self, message: str):
        print(f"[{self.name}:INFO] {message}")

