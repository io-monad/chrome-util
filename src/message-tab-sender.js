import _ from "lodash";
import promisify from "./promisify";
import normalizeMessageTypes from "./helpers/normalize-message-types";
import tabs from "./tabs";

/**
 * Message sender using chrome.tabs.sendMessage
 *
 * @example
 *     const messages = ["FOO", "BAR"];  // or { FOO: "foo", BAR: "bar" }
 *     const sender = new MessageTabSender(messages);
 *
 *     sender.sendFoo(tabId);
 *     sender.sendBar(tabId, { abc: 1, def: "x" }).then(response => { ... });
 *
 *     sender.sendFooToActiveTab();
 *     sender.sendBarToActiveTab({ abc:1, def: "x" }).then(response => { ... });
 */
export default class MessageTabSender {
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
      this[_.camelCase(`send-${type}`)] = (tabId, message) => {
        return this._send(type, tabId, message);
      };
      this[_.camelCase(`send-${type}-ToActiveTab`)] = (message) => {
        return this._sendToActiveTab(type, message);
      };
    });
  }

  _send(type, tabId, message) {
    return promisify(callback => {
      message = _.extend({ type }, message);
      chrome.tabs.sendMessage(tabId, message, response => {
        if (response && response.error) {
          callback(null, response.error);
        } else {
          callback(response);
        }
      });
    });
  }

  _sendToActiveTab(type, message) {
    return tabs.getActiveTab().then(tab => {
      if (!tab) return Promise.reject("No active tab");
      return this._send(type, tab.id, message);
    });
  }
}
