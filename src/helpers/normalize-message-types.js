import _ from "lodash";

/**
 * Normalize message types into mappings.
 *
 * @param {string[]|Object.<string, any>} messageTypes
 * @return {Object.<string, string>}
 *    Keys and values are message types in upper case.
 * @ignore
 */
export default function normalizeMessageTypes(messageTypes) {
  if (!_.isArray(messageTypes)) {
    messageTypes = _.keys(messageTypes);
  }
  return _.transform(messageTypes, (acc, type) => {
    type = type.toUpperCase();
    acc[type] = type;
  }, {});
}
