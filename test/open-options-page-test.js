import "./test-helper";
import openOptionsPage from "../src/open-options-page";

/** @test {openOptionsPage} */
describe("openOptionsPage", () => {
  context("with chrome.runtime.openOptionsPage available", () => {
    it("calls openOptionsPage", () => {
      openOptionsPage();
      assert(chrome.runtime.openOptionsPage.calledOnce === true);
    });
  });

  context("with chrome.runtime.openOptionsPage unavailable", () => {
    let backupRuntime;
    beforeEach(() => {
      backupRuntime = chrome.runtime;
      chrome.runtime = { openOptionsPage: null };
    });
    afterEach(() => {
      chrome.runtime = backupRuntime;
    });

    it("opens a new tab of options page", () => {
      chrome.extension.getURL.returns("/options");
      chrome.tabs.query.callsArgWith(1, []);

      openOptionsPage();

      assert(chrome.extension.getURL.calledOnce === true);
      assert(chrome.extension.getURL.args[0][0] === "pages/options.html");

      assert(chrome.tabs.query.calledOnce === true);
      assert.deepEqual(chrome.tabs.query.args[0][0], { url: "/options" });

      assert(chrome.tabs.create.calledOnce === true);
      assert.deepEqual(chrome.tabs.create.args[0][0], { url: "/options" });
    });

    it("activates options tab if exist", () => {
      chrome.extension.getURL.returns("/options");
      chrome.tabs.query.callsArgWith(1, [{ id: 123 }]);

      openOptionsPage();

      assert(chrome.extension.getURL.calledOnce === true);
      assert(chrome.extension.getURL.args[0][0] === "pages/options.html");

      assert(chrome.tabs.query.calledOnce === true);
      assert.deepEqual(chrome.tabs.query.args[0][0], { url: "/options" });

      assert(chrome.tabs.update.calledOnce === true);
      assert(chrome.tabs.update.args[0][0] === 123);
      assert.deepEqual(chrome.tabs.update.args[0][1], { active: true });
    });
  });
});
