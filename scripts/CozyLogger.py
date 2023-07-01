
# This is a simple logger class that will be used to log messages stdout
# check the config if log is enabled
class CozyLoggerClass:
    def __init__(self, name: str, config):

        self.name = name
        self.log_enabled = config["log_enabled"]

    def debug(self, message: str):
        if self.log_enabled:
            print(f"[{self.name}] {message}")
