import _ from "lodash";
import promisify from "./promisify";
import normalizeMessageTypes from "./helpers/normalize-message-types";
import defineSendMethods from "./helpers/define-send-methods";

/**
 * Message sender for sandbox iframe using postMessage.
 *
 * @example
 *     const iframe = document.getElementById("sandbox");
 *     const messages = ["FOO", "BAR"];  // or { FOO: "foo", BAR: "bar" }
 *     const sender = new SandboxSender(iframe, messages);
 *
 *     sender.sendFoo();
 *     sender.sendBar({ abc: 1, def: "x" }).then(response => { ... });
 */
export default class SandboxSender {
  /**
   * @param {IframeElement} iframe - iframe element to which messages are sent.
   * @param {string[]|Object.<string, any>} messageTypes
   *     Known message types.
   * @param {Object} [options] - Options.
   * @param {number} [options.timeout=30000] - Request timeout milliseconds.
   */
  constructor(iframe, messageTypes, options) {
    this._iframe = iframe;
    this._messageTypeMap = normalizeMessageTypes(messageTypes);
    this._messageTypes = Object.keys(this._messageTypeMap);
    defineSendMethods(this, this._messageTypes, this._send);

    options = options || {};
    this._timeout = options.timeout || 30 * 1000;
    this._requestId = 0;
    this._responders = {};
    this._bindMessageEvent();
  }

  _bindMessageEvent() {
    this._handleWindowMessage = this._handleWindowMessage.bind(this);
    window.addEventListener("message", this._handleWindowMessage);
  }

  _send(type, message) {
    return promisify(callback => {
      message = _.extend({ type, requestId: ++this._requestId }, message);
      this._listenForResponse(message.requestId, callback);
      try {
        this._iframe.contentWindow.postMessage(message, "*");
      } catch (err) {
        delete this._responders[message.requestId];
        throw err; // will reject Promise
      }
    });
  }

  _listenForResponse(requestId, callback) {
    this._responders[requestId] = {
      timestamp: _.now(),
      callback,
    };
    this._scheduleFlush();
  }

  _handleWindowMessage(event) {
    const message = event.data;
    if (message && _.isNumber(message.requestId)) {
      const responder = this._responders[message.requestId];
      if (responder) {
        delete this._responders[message.requestId];

        const callback = responder.callback;
        const response = message.response;
        if (response && response.error) {
          callback(null, response.error);
        } else {
          callback(message.response);
        }
      }
    }
  }

  _scheduleFlush() {
    this._scheduleFlush = _.debounce(() => {
      this._flushTimeoutResponders();
    }, this._timeout);
    this._scheduleFlush();
  }

  _flushTimeoutResponders() {
    const expire = _.now() - this._timeout;
    _.each(this._responders, ({ timestamp, callback }, requestId) => {
      if (timestamp <= expire) {
        delete this._responders[requestId];
        callback(null, `Request has timed out after ${this._timeout}ms`);
      }
    });
  }
}
