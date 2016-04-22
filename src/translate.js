import camelCase from "lodash.camelcase";

/**
 * Get a translation of given key.
 *
 * This warns for missing translation by `console.warn`.
 *
 * @param {string} key - Key of translation.
 *     This is processed by `lodash.camelCase` automatically, so you can
 *     pass for example "foo bar" for getting translation of `fooBar`.
 * @param {any} [substitutions] - Substitutions for translation.
 * @param {string} [fallback] - Fallback for translation.
 * @return {string} Translation.
 *    If there is no translation for given key, it returns an empty string.
 * @see https://developer.chrome.com/extensions/i18n
 */
export default function translate(key, substitutions, fallback) {
  if (typeof substitutions === "string" && typeof fallback === "undefined") {
    fallback = substitutions;
    substitutions = undefined;
  }

  key = camelCase(key);
  const translated = chrome.i18n.getMessage(key, substitutions);
  if (translated === "" && typeof fallback === "undefined") {
    console.warn(`No translation for "${key}"`);
  }

  return translated || fallback || "";
}
