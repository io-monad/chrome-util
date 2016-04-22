import "./test-helper";
import openStorePage from "../src/open-store-page";

/** @test {openStorePage} */
describe("openStorePage", () => {
  it("opens a new tab of store page", () => {
    chrome.i18n.getMessage.withArgs("@@extension_id").returns("abc123");

    openStorePage();

    assert(chrome.tabs.create.calledOnce);
    assert.deepEqual(chrome.tabs.create.args[0][0], {
      url: "https://chrome.google.com/webstore/detail/currently/abc123",
    });
  });
});
