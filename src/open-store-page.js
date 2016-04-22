/**
 * Open a store page of the extension.
 */
export default function openStorePage() {
  const extensionId = chrome.i18n.getMessage("@@extension_id");
  const url = `https://chrome.google.com/webstore/detail/currently/${extensionId}`;
  chrome.tabs.create({ url });
}
