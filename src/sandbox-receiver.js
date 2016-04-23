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
    const type = message.type.toUpperCase();

    const handler = this._handlers[type];
    if (handler) {
      let isResponded = false;
      const sendResponse = (response) => {
        if (isResponded) throw new Error("sendResponse is called twice");
        isResponded = true;
        event.source.postMessage({ requestId, response }, event.origin);
      };

      const ret = handler.call(this._thisObj, message, sendResponse);
      if (isPromise(ret)) {
        // Not chainning then and catch not to call sendResponse twice
        ret.then(
          response => sendResponse(response),
          error => sendResponse({ error: error.message || error })
        );
      } else if (ret !== true) {
        // Returning non-`true` means sendResponse is called synchronously
        // In this case we should respond automatically with empty response
        if (!isResponded) sendResponse(null);
      }
    }
  }
}

/**
 * Handler function for a received message in SandboxReceiver.
 *
 * @typedef {Function} SandboxReceiver~ReceiverFunction
 * @param {Object} message - Received message.
 * @param {function (response:any):void} sendResponse
 *     Callback function to send response.
 * @return {boolean|Promise}
 *     Return `true` to indicate that sendResponse is called asynchronously.
 *     Otherwise sendResponse is called automatically.
 *
 *     You can also return `Promise`-like object, and in that case it will
 *     automatically calls `sendResponse` with the resolved value,
 *     or the rejected value with `sendResponse({ error: rejectedValue })`.
 */
