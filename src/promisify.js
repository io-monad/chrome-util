/**
 * Wrap Chrome-style async function call with Promise.
 *
 * @param {function (callback: Function):void} fn
 *    Function which is called in the Promise.
 *    It should use `callback` for Chrome-style async function.
 * @return {Promise.<any>} Promise of async function `fn`.
 *    It resolves to the value passed to `callback` for `fn`.
 *    If `chrome.runtime.lastError` is set after calling `fn`, it is rejected
 *    with `chrome.runtime.lastError`.
 */
export default function promisify(fn) {
  return new Promise((resolve, reject) => {
    fn.call(null, (response, err) => {
      if (chrome.runtime.lastError || err) {
        reject(chrome.runtime.lastError || err);
      } else {
        resolve(response);
      }
    });
  });
}
