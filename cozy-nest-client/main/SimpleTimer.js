import {CozyLogger} from './CozyLogger';

export default class SimpleTimer {

  static timers = {};

  // static method to create a new instance of SimpleTimer
  static time(timerName) {
    SimpleTimer.timers[timerName] = new SimpleTimer(timerName)
    return SimpleTimer.timers[timerName];
  }

  static end(timerName) {
    const elapsedTime = SimpleTimer.timers[timerName].end();
    CozyLogger.debug(`SimpleTimer: end ${timerName} in ${elapsedTime}ms`)
    return elapsedTime;
  }

  static last(timerName) {
    return localStorage.getItem(timerName) && Number(localStorage.getItem(timerName));
  }

  static get(timerName) {
    return SimpleTimer.timers[timerName].get();
  }

  // constructor
  constructor(timerName) {
    this.timerName = timerName;
    this.startTime = new Date();
  }

  // method to get the elapsed time
  get() {
    const endTime = new Date();
     //in ms
    return endTime - this.startTime;
  }

  // method to end the timer
  end() {
    const endTime = new Date();
    const timeDiff = endTime - this.startTime; //in ms

    //save the time in the local storage
    localStorage.setItem(this.timerName, `${timeDiff}`);

    return timeDiff;
  }
}