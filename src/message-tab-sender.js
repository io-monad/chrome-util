import extend from "lodash/extend";
import promisify from "./promisify";
import normalizeMessageTypes from "./helpers/normalize-message-types";
import defineSendMethods from "./helpers/define-send-methods";

/**
 * Message sender using chrome.tabs.sendMessage
 *
 * @example
 *     const messages = ["FOO", "BAR"];  // or { FOO: "foo", BAR: "bar" }
 *     const sender = new MessageTabSender(messages);
 *
 *     sender.sendFoo(tabId);
 *     sender.sendBar(tabId, { abc: 1, def: "x" }).then(response => { ... });
 */
export default class MessageTabSender {
  /**
   * @param {string[]|Object.<string, any>} messageTypes
   *     Known message types.
   */
  constructor(messageTypes) {
    this._messageTypeMap = normalizeMessageTypes(messageTypes);
    this._messageTypes = Object.keys(this._messageTypeMap);
    defineSendMethods(this, this._messageTypes, this._send);
  }

  _send(type, tabId, message) {
    return promisify(callback => {
      message = extend({ type }, message);
      chrome.tabs.sendMessage(tabId, message, response => {
        if (response && response.error) {
          callback(null, response.error);
        } else {
          callback(response);
        }
      });
    });
  }
}
