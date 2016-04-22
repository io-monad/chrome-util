/**
 * Open options page with support for older Chrome.
 *
 * @param {string} pagePath - Path of options page.
 */
export default function openOptionsPage(pagePath = "pages/options.html") {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    const url = chrome.extension.getURL(pagePath);
    chrome.tabs.query({ url }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.create({ url });
      }
    });
  }
}
