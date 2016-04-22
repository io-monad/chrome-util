import promisify from "./promisify";

const local = chrome.storage.local;
const sync = chrome.storage.sync || local;  // Fallback for Firefox

/**
 * chrome.storage Promise interface.
 *
 * @see https://developer.chrome.com/extensions/storage
 */
export default class Storage {
  /**
   * Get multiple values from sync storage.
   *
   * @param {string[]|string} keys - Keys in storage.
   * @return {Promise.<Object.<string, any>>}
   *    Map of loaded values from storage.
   */
  static syncGet(keys) {
    return promisify(cb => { sync.get(keys, cb); });
  }

  /**
   * Get single value from sync storage.
   *
   * @param {string} key - Key in storage.
   * @return {Promise.<any>}
   *    Loaded value from storage, or `undefined` for missing key.
   */
  static syncGetValue(key) {
    return promisify(cb => {
      sync.get(key, items => {
        cb(items.hasOwnProperty(key) ? items[key] : undefined);
      });
    });
  }

  /**
   * Set multiple values into sync storage.
   *
   * @param {Object.<string, any>} items - Map of saving values.
   * @return {Promise}
   */
  static syncSet(items) {
    return promisify(cb => sync.set(items, cb));
  }

  /**
   * Set single value into sync storage.
   *
   * @param {string} key - Key for saved value.
   * @param {any} value - Saved value.
   * @return {Promise}
   */
  static syncSetValue(key, value) {
    return promisify(cb => sync.set({ [key]: value }, cb));
  }

  /**
   * Remove multiple values from sync storage.
   *
   * @param {string[]|string} keys - Removed keys.
   * @return {Promise}
   */
  static syncRemove(keys) {
    return promisify(cb => sync.remove(keys, cb));
  }

  /**
   * Clear all values in sync storage.
   *
   * @return {Promise}
   */
  static syncClear() {
    return promisify(cb => sync.clear(cb));
  }

  /**
   * Get multiple values from local storage.
   *
   * @param {string[]|string} keys - Keys in storage.
   * @return {Promise.<Object.<string, any>>}
   *    Map of loaded values from storage.
   */
  static localGet(keys) {
    return promisify(cb => { local.get(keys, cb); });
  }

  /**
   * Get single value from local storage.
   *
   * @param {string} key - Key in storage.
   * @return {Promise.<any>}
   *    Loaded value from storage, or `undefined` for missing key.
   */
  static localGetValue(key) {
    return promisify(cb => {
      local.get(key, items => {
        cb(items.hasOwnProperty(key) ? items[key] : undefined);
      });
    });
  }

  /**
   * Set multiple values into local storage.
   *
   * @param {Object.<string, any>} items - Map of saving values.
   * @return {Promise}
   */
  static localSet(items) {
    return promisify(cb => local.set(items, cb));
  }

  /**
   * Set single value into local storage.
   *
   * @param {string} key - Key for saved value.
   * @param {any} value - Saved value.
   * @return {Promise}
   */
  static localSetValue(key, value) {
    return promisify(cb => local.set({ [key]: value }, cb));
  }

  /**
   * Remove multiple values from local storage.
   *
   * @param {string} keys - Removed keys.
   * @return {Promise}
   */
  static localRemove(keys) {
    return promisify(cb => local.remove(keys, cb));
  }

  /**
   * Clear all values in local storage.
   *
   * @return {Promise}
   */
  static localClear() {
    return promisify(cb => local.clear(cb));
  }
}
