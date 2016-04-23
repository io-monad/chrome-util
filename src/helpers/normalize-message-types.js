import isArray from "lodash/isArray";
import keys from "lodash/keys";
import transform from "lodash/transform";

/**
 * Normalize message types into mappings.
 *
 * @param {string[]|Object.<string, any>} messageTypes
 * @return {Object.<string, string>}
 *    Keys and values are message types in upper case.
 * @ignore
 */
export default function normalizeMessageTypes(messageTypes) {
  if (!isArray(messageTypes)) {
    messageTypes = keys(messageTypes);
  }
  return transform(messageTypes, (acc, type) => {
    type = type.toUpperCase();
    acc[type] = type;
  }, {});
}
