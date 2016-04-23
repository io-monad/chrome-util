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

    let isAsync = false;
    const type = message.type.toUpperCase();
    const handler = this._handlers[type];
    if (handler) {
      const ret = handler.call(this._thisObj, message, sender);
      if (isPromise(ret)) {
        ret.then(
          response => sendResponse(response),
          error => sendResponse({ error: error.message || error })
        );
        isAsync = true;
      } else {
        sendResponse(ret);
        isAsync = false;
      }
    }
    return isAsync;
  }
}

/**
 * Handler function for a received message.
 *
 * @typedef {Function} MessageReceiver~ReceiverFunction
 * @param {Object} message - Received message.
 * @param {Object} sender - Sender information.
 *     See Chrome API documentation for details.
 * @return {any|Promise}
 *     Any value to be returned to the sender as response.
 *
 *     If it is a Promise, its resolved value is returned to the sender,
 *     or its rejected value is returned as error response.
 *
 * @see https://developer.chrome.com/extensions/runtime#event-onMessage
 * @see https://developer.chrome.com/extensions/runtime#event-onMessageExternal
 */
