/**
 * @external {chrome~Tab} https://developer.chrome.com/extensions/tabs#type-Tab
 */

/**
 * Utility for tabs.
 *
 * @see https://developer.chrome.com/extensions/tabs
 */
export default class Tabs {
  /**
   * Get an active tab with Promise.
   *
   * @return {Promise.<chrome~Tab|null>} Promise of active tab instance.
   *     If there is no active tab, it resolves to `null`.
   */
  static getActiveTab() {
    return new Promise(resolve => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => { resolve(tabs[0] || null); }
      );
    });
  }

  /**
   * Call a function with an active tab instance.
   *
   * Note: `fn` is never called when there is no active tab.
   *
   * @param {function (tab: chrome~Tab): void} fn - Callback function.
   */
  static withActiveTab(fn) {
    Tabs.getActiveTab().then(tab => {
      if (tab) fn(tab);
    });
  }

  /**
   * Get a tab instance specified by tab ID with Promise.
   *
   * @param {number} tabId - Tab ID.
   * @return {Promise.<chrome~Tab|null>} Promise of tab instance.
   *    If there is no tab for tab ID, it resolves to `null`.
   */
  static getTab(tabId) {
    return new Promise(resolve => {
      chrome.tabs.get(tabId, tab => {
        resolve(tab || null);
      });
    });
  }

  /**
   * Call a function with a tab instance specified by tab ID.
   *
   * Note: `fn` is never called when there is no tab for tab ID.
   *
   * @param {number} tabId - Tab ID.
   * @param {function (tab: chrome~Tab): void} fn - Callback function.
   */
  static withTab(tabId, fn) {
    Tabs.getTab(tabId).then(tab => {
      if (tab) fn(tab);
    });
  }
}
