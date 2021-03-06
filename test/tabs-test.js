import "./test-helper";
import tabs from "../src/tabs";

/** @test {Tabs} */
describe("Tabs", () => {
  function assertActiveTabQuery() {
    assert(chrome.tabs.query.calledOnce === true);
    assert.deepEqual(
      chrome.tabs.query.args[0][0],
      { active: true, currentWindow: true }
    );
  }

  /** @test {Tabs.getActiveTab} */
  describe(".getActiveTab", () => {
    it("returns Promise of active tab", () => {
      const dummyTab = {};
      chrome.tabs.query.yieldsAsync([dummyTab]);

      return tabs.getActiveTab().then(tab => {
        assert(tab === dummyTab);
        assertActiveTabQuery();
      });
    });

    it("returns Promise of null when no active tab", () => {
      chrome.tabs.query.yieldsAsync([]);

      return tabs.getActiveTab().then(tab => {
        assert(tab === null);
        assertActiveTabQuery();
      });
    });
  });

  /** @test {Tabs.withActiveTab} */
  describe(".withActiveTab", () => {
    it("calls given function with active tab", (done) => {
      const dummyTab = {};
      chrome.tabs.query.yieldsAsync([dummyTab]);

      tabs.withActiveTab(tab => {
        assert(tab === dummyTab);
        assertActiveTabQuery();
        done();
      });
    });

    it("never calls given function when no active tab", () => {
      chrome.tabs.query.yieldsAsync([]);

      tabs.withActiveTab(() => { assert(false); });
      assertActiveTabQuery();
    });
  });

  /** @test {Tabs.getTab} */
  describe(".getTab", () => {
    it("returns Promise of tab of given ID", () => {
      const dummyTab = {};
      chrome.tabs.get.yieldsAsync(dummyTab);

      return tabs.getTab(123).then(tab => {
        assert(tab === dummyTab);
        assert(chrome.tabs.get.calledOnce === true);
        assert(chrome.tabs.get.args[0][0] === 123);
      });
    });

    it("returns Promise of null when no tab of given ID", () => {
      chrome.tabs.get.yieldsAsync(null);

      return tabs.getTab(123).then(tab => {
        assert(tab === null);
        assert(chrome.tabs.get.calledOnce === true);
        assert(chrome.tabs.get.args[0][0] === 123);
      });
    });
  });

  /** @test {Tabs.withTab} */
  describe(".withTab", () => {
    it("calls given function with tab of given ID", (done) => {
      const dummyTab = {};
      chrome.tabs.get.yieldsAsync(dummyTab);

      tabs.withTab(123, tab => {
        assert(tab === dummyTab);
        assert(chrome.tabs.get.calledOnce === true);
        assert(chrome.tabs.get.args[0][0] === 123);
        done();
      });
    });

    it("never calls given function when no tab of given ID", () => {
      chrome.tabs.get.yieldsAsync(null);

      tabs.withTab(123, () => { assert(false); });
      assert(chrome.tabs.get.calledOnce === true);
      assert(chrome.tabs.get.args[0][0] === 123);
    });
  });
});
