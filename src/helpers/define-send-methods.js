import _ from "lodash";

/**
 * Define send methods to message sender.
 *
 * @param {Object} messageSender
 * @param {string[]} messageTypes
 * @param {Function} method
 * @ignore
 */
export default function defineSendMethods(messageSender, messageTypes, method) {
  messageTypes.forEach(type => {
    messageSender[_.camelCase(`send-${type}`)] = (...args) => {
      return method.call(messageSender, type, ...args);
    };
  });
}
