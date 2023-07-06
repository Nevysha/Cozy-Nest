import json
import os
from pathlib import Path

from modules import shared


def is_log_enabled():
    if shared.cmd_opts.cozy_nest_debug:
        return True
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


CozyLogger = CozyLoggerClass("Cozy")
if CozyLoggerClass.LOG_ENABLED:
    CozyLogger.warning("Logger enabled")

CozyLoggerExtNe = CozyLoggerClass("Cozy:ExtNe")
CozyLoggerConfig = CozyLoggerClass("Cozy:Config")
CozyLoggerImageBrowser = CozyLoggerClass("Cozy:ImageBrowser")
