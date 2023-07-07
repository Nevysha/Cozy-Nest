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
        self.tag = f"[{self.name}]"
        self.log_enabled = CozyLoggerClass.LOG_ENABLED
        from scripts.cozy_lib.CozyNestConfig import CozyNestConfig
        self.config = CozyNestConfig.instance()
        if self.config.is_sdnext():
            import logging
            if CozyLoggerClass.LOG_ENABLED:
                logging.getLogger(name).setLevel(logging.DEBUG)
            else:
                logging.getLogger(name).setLevel(logging.INFO)

            base_log = logging.getLogger("sd")
            logging.getLogger(name).handlers = base_log.handlers

    def format_message(self, message: str):
        if self.config.is_sdnext():
            return f"{self.tag} {message}"
        else:
            return message

    def debug(self, message: str):
        message = self.format_message(message)
        if self.config.is_sdnext():
            import logging
            logging.getLogger(self.name).debug(message)
        else:
            if self.log_enabled:
                print(f"[{self.name}:DEBUG] {message}")

    def warning(self, message: str):
        message = self.format_message(message)
        if self.config.is_sdnext():
            import logging
            logging.getLogger(self.name).warning(message)
        else:
            print(f"[{self.name}:WARNING] {message}")

    def info(self, message: str):
        message = self.format_message(message)
        if self.config.is_sdnext():
            import logging
            logging.getLogger(self.name).info(message)
        else:
            print(f"[{self.name}:INFO] {message}")

    def error(self, message: str, exception: Exception = None):
        message = self.format_message(message)
        if self.config.is_sdnext():
            import logging
            logging.getLogger(self.name).error(message, exc_info=exception)
        else:
            print(f"[{self.name}:ERROR] {message}")
            if exception is not None:
                print(exception)


CozyLogger = CozyLoggerClass("CozyNest")
if CozyLoggerClass.LOG_ENABLED:
    CozyLogger.debug("Logger enabled")

CozyLoggerExtNe = CozyLoggerClass("Cozy:ExtNe")
CozyLoggerConfig = CozyLoggerClass("Cozy:Config")
CozyLoggerImageBrowser = CozyLoggerClass("Cozy:ImageBrowser")
