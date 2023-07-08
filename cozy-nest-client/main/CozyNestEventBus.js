import EventEmitter from 'eventemitter3';

/**
 * Singleton class that handles the event bus for the Cozy Nest extension.
 * user eventemitter3
 */
class CozyNestEventBus extends EventEmitter{
  constructor() {
    super();
  }
}

export default new CozyNestEventBus();