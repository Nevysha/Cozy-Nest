import cozyNestLoader from "./nevysha-cozy-nest.js";

export class CozyLogger {

  static _instance = null;

  static init(enabled) {
    if (!CozyLogger._instance) {
      CozyLogger._instance = new CozyLogger(enabled);
    }
    return CozyLogger._instance;
  }

  static enable() {
    CozyLogger._instance.enabled = true;
  }
  static disable() {
    CozyLogger._instance.enabled = false;
  }

  static debug(...args) {
    if (CozyLogger._instance.enabled) {
      console.log('CozyNest:DEBUG:',...args);
    }
  }

  static log(...args) {
    console.log('CozyNest:',...args);
  }

  constructor(enabled) {
    this.enabled = enabled;
  }
}

if (import.meta.env.VITE_CONTEXT === 'DEV') {
  CozyLogger.init(true);
}
else {
  CozyLogger.init(false);
}

window.CozyLogger = CozyLogger;