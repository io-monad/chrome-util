/** @external {events~EventEmitter} https://nodejs.org/api/events.html#events_class_eventemitter */
import EventEmitter from "events";

/**
 * A simple wrapper for chrome.alarms API
 *
 * @see https://developer.chrome.com/extensions/alarms
 * @example
 *     const alarm = new Alarm("myalarm");
 *     alarm.on("alarm", () => {
 *       // Do something
 *     });
 *     alarm.start({ periodInMinutes: 5 });
 */
export default class Alarm extends EventEmitter {
  /**
   * @param {string} name - Name of the alarm.
   */
  constructor(name) {
    super();

    /**
     * Name of the alarm.
     * @type {string}
     */
    this.name = name;

    this._bindAlarmEvent();
  }

  /**
   * Start the alarm.
   *
   * @param {Object} options - Alarm options.
   *     See Chrome API document for details.
   * @emits {alarm} when the alarm is ringing.
   * @see https://developer.chrome.com/extensions/alarms#method-create
   */
  start(options) {
    chrome.alarms.create(this.name, options);
  }

  /**
   * Stop the alarm.
   *
   * @return {Promise.<boolean>}
   */
  stop() {
    return new Promise(resolve => {
      chrome.alarms.clear(this.name, resolve);
    });
  }

  _bindAlarmEvent() {
    chrome.alarms.onAlarm.addListener(alarm => {
      if (alarm.name === this.name) {
        this.emit("alarm", this);
      }
    });
  }
}
