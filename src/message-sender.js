import _ from "lodash";
import promisify from "./promisify";
import normalizeMessageTypes from "./helpers/normalize-message-types";

/**
 * Message sender using chrome.runtime.sendMessage
 *
 * @example
 *     const messages = ["FOO", "BAR"];  // or { FOO: "foo", BAR: "bar" }
 *     const sender = new MessageSender(messages);
 *
 *     sender.sendFoo();
 *     sender.sendBar({ abc: 1, def: "x" }).then(response => { ... });
 */
export default class MessageSender {
  /**
   * @param {string[]|Object.<string, any>} messageTypes
   *     Known message types.
   */
  constructor(messageTypes) {
    this._messageTypeMap = normalizeMessageTypes(messageTypes);
    this._messageTypes = Object.keys(this._messageTypeMap);
    this._defineSendMethods();
  }

  _defineSendMethods() {
    this._messageTypes.forEach(type => {
      this[_.camelCase(`send-${type}`)] = (message) => {
        return this._send(type, message);
      };
    });
  }

  _send(type, message) {
    return promisify(callback => {
      message = _.extend({ type }, message);
      chrome.runtime.sendMessage(message, response => {
        if (response && response.error) {
          callback(null, response.error);
        } else {
          callback(response);
        }
      });
    });
  }
}
