class CozyLoggerClass {

  static init(enabled) {
    return new CozyLoggerClass(enabled);
  }

  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }

  group(name) {
    if (this.enabled) {
      console.group(name);
    }
  }
  groupEnd() {
    if (this.enabled) {
      console.groupEnd();
    }
  }

  debug(...args) {
    if (this.enabled) {
      console.log('CozyNest:DEBUG:',...args);
    }
  }

  log(...args) {
    console.log('CozyNest:',...args);
  }

  error(...args) {
    console.error('CozyNest:',...args);
  }

  constructor(enabled) {
    this.enabled = enabled;
  }
}

const isDev = import.meta.env.VITE_CONTEXT === 'DEV'
export const CozyLogger = CozyLoggerClass.init(isDev);
export const CozyLoggerPrompt = CozyLoggerClass.init(import.meta.env.PROMPT_LOGGING === 1);

window.CozyLogger = CozyLogger;