/**
 * Get the version of the extension.
 *
 * @return {string} Version string.
 */
export default function getVersion() {
  const manifest = chrome.runtime.getManifest();
  return manifest.version;
}
