/**
 * Aggregated interface for classes and functions.
 *
 * @type {Object}
 * @example
 *     import { getVersion } from "@io-monad/chrome-util";
 *
 *     import ChromeUtil from "@io-monad/chrome-util";
 *     const version = ChromeUtil.getVersion();
 */
export default class ChromeUtil {
  /** @type {Class.<Alarm>} */
  static get Alarm() { return require("./alarm"); }
  /** @type {getVersion} */
  static get getVersion() { return require("./get-version"); }
  /** @type {Class.<MessageReceiver>} */
  static get MessageReceiver() { return require("./message-receiver"); }
  /** @type {Class.<MessageSender>} */
  static get MessageSender() { return require("./message-sender"); }
  /** @type {Class.<MessageTabSender>} */
  static get MessageTabSender() { return require("./message-tab-sender"); }
  /** @type {openOptionsPage} */
  static get openOptionsPage() { return require("./open-options-page"); }
  /** @type {openStorePage} */
  static get openStorePage() { return require("./open-store-page"); }
  /** @type {promisify} */
  static get promisify() { return require("./promisify"); }
  /** @type {Class.<Storage>} */
  static get storage() { return require("./storage"); }
  /** @type {Class.<Tabs>} */
  static get tabs() { return require("./tabs"); }
  /** @type {translateMessage} */
  static get translateMessage() { return require("./translate-message"); }
  /** @type {translate} */
  static get translate() { return require("./translate"); }
}
