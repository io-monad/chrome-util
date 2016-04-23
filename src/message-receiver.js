import isPromise from "is-promise";
import normalizeMessageHandlers from "./helpers/normalize-message-handlers";

/**
 * Message receiver for Chrome messaging spec.
 *
 * @example
 *     const receiver = new MessageReceiver({
 *       FOO: this.handleFoo,
 *       BAR: this.handleBar,
 *     }, this);
 *     chrome.runtime.onMessage.addLister(receiver.listener);
 */
export default class MessageReceiver {
  /**
   * @param {Object.<string, MessageReceiver~ReceiverFunction>} handlers
   *     Mappings of message types to handler functions.
   * @param {Object} [thisObj] `this` context for calling handlers.
   */
  constructor(handlers, thisObj) {
    this._handlers = normalizeMessageHandlers(handlers);
    this._thisObj = thisObj || null;

    /**
     * Bound version of {@link MessageReceiver#receive}.
     *
     * You can use this for `addListener` without binding.
     *
     * @type {Function}
     */
    this.listener = this.receive.bind(this);
  }

  /**
   * Receive a message and dispatch it to a message handler.
   *
   * Use {@link MessageReceiver#listener} for `addListener` of
   * incoming message event.
   *
   * @param {Object} message - Received message.
   * @param {Object} sender - Sender information.
   * @param {Function} sendResponse - Callback function to send reponse.
   * @return {boolean} Whether sendResponse is called asynchronously.
   */
  receive(message, sender, sendResponse) {
    if (!message || typeof message.type !== "string") {
      console.warn("Unknown message format received", message);
      return false;
    }

    let ret = false;
    const type = message.type.toUpperCase();
    const handler = this._handlers[type];
    if (handler) {
      ret = handler.call(this._thisObj, message, sender, sendResponse);
      if (isPromise(ret)) {
        // Not chainning then and catch not to call sendResponse twice
        ret.then(response => sendResponse(response));
        ret.catch(error => sendResponse({ error: error.message || error }));
        ret = true;  // Mark it as async response
      }
    }
    return ret;
  }
}

/**
 * Handler function for a received message.
 *
 * @typedef {Function} MessageReceiver~ReceiverFunction
 * @param {Object} message - Received message.
 * @param {Object} sender - Sender information.
 *     See Chrome API documentation for details.
 * @param {function (response:any):void} sendResponse
 *     Callback function to send response.
 * @return {boolean|Promise}
 *     Return `true` to indicate that sendResponse is called asynchronously.
 *
 *     You can also return `Promise`-like object, and in that case it will
 *     automatically calls `sendResponse` with the resolved value,
 *     or the rejected value with `sendResponse({ error: rejectedValue })`.
 *
 * @see https://developer.chrome.com/extensions/runtime#event-onMessage
 * @see https://developer.chrome.com/extensions/runtime#event-onMessageExternal
 */
