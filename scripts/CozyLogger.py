
# This is a simple logger class that will be used to log messages stdout
# check the config if log is enabled
class CozyLoggerClass:
    def __init__(self, name: str, log_enabled):

        self.name = name
        self.log_enabled = log_enabled

        if self.log_enabled:
            print(f"[{self.name}:DEBUG] Logger enabled. Disable in nevyui_settings.json")

    def debug(self, message: str):
        if self.log_enabled:
            print(f"[{self.name}:DEBUG] {message}")

    def warning(self, message: str):
        print(f"[{self.name}:WARNING] {message}")
