import _ from "lodash";
import isPromise from "is-promise";
import normalizeMessageHandlers from "./helpers/normalize-message-handlers";

/**
 * Message receiver for sandbox iframe using postMessage.
 *
 * @example
 *     const receiver = new SandboxReceiver({
 *       FOO: this.handleFoo,
 *       BAR: this.handleBar,
 *     }, this);
 */
export default class SandboxReceiver {
  /**
   * @param {Object.<string, SandboxReceiver~ReceiverFunction>} handlers
   *     Mappings of message types to handler functions.
   * @param {Object} [thisObj] `this` context for calling handlers.
   */
  constructor(handlers, thisObj) {
    this._handlers = normalizeMessageHandlers(handlers);
    this._thisObj = thisObj || null;
    this._bindMessageEvent();
  }

  _bindMessageEvent() {
    this._handleWindowMessage = this._handleWindowMessage.bind(this);
    window.addEventListener("message", this._handleWindowMessage);
  }

  _handleWindowMessage(event) {
    const message = event.data;
    if (!message || !_.isNumber(message.requestId) || !_.isString(message.type)) {
      console.warn("Unknown message format received", message);
      return;
    }

    const requestId = message.requestId;
    const respond = (response) => {
      event.source.postMessage({ requestId, response }, event.origin);
    };

    const type = message.type.toUpperCase();
    const handler = this._handlers[type];
    if (handler) {
      const ret = handler.call(this._thisObj, message);
      if (isPromise(ret)) {
        ret.then(
          response => { respond(response); },
          error => { respond({ error: error.message || error }); }
        );
      } else {
        respond(ret);
      }
    }
  }
}

/**
 * Handler function for a received message in SandboxReceiver.
 *
 * @typedef {Function} SandboxReceiver~ReceiverFunction
 * @param {Object} message - Received message.
 * @return {Promise|any}
 *     Any value to be returned to the sender as response.
 *
 *     If it is a Promise, its resolved value is returned to the sender,
 *     or its rejected value is returned as error response.
 */
