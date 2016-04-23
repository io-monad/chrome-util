import _ from "lodash";

/**
 * Normalize message types into mappings.
 *
 * This also checks type of input handler function.
 *
 * @param {Object.<string, Function>} handlers
 *     Mappings of message types to handler functions.
 * @return {Object.<string, Function>}
 *    Keys are message types in upper case. Values are handler functions.
 * @ignore
 */
export default function normalizeMessageHandlers(handlers) {
  return _.mapKeys(handlers, (handler, key) => {
    if (typeof handler !== "function") {
      throw new Error(`Non-Function method for ${key}`);
    }
    return key.toUpperCase();
  });
}
