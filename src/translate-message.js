import camelCase from "lodash.camelcase";

/**
 * Get a translation of message.
 *
 * This interprets `__MSG_(\w+)__` in the message by translations.
 *
 * This warns for missing translation by `console.warn`.
 *
 * @param {string} message - Message.
 * @return {string} Translated message.
 */
export default function translateMessage(message) {
  return String(message || "").replace(/__MSG_(\w+)__/g, (m, key) => {
    key = camelCase(key);
    const translated = chrome.i18n.getMessage(key);

    if (translated === "") {
      console.warn(`No translation for "${m}"`);
    }

    return translated;
  });
}
