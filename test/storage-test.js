import "./test-helper";
import storage from "../src/storage";

/** @test {Storage} */
describe("storage", () => {
  /** @test {Storage.syncGet} */
  describe(".syncGet", () => {
    it("returns Promise of loaded values from sync storage", (done) => {
      const keys = ["foo", "bar"];
      const loaded = { foo: "abc", bar: 123 };
      chrome.storage.sync.get.callsArgWithAsync(1, loaded);

      storage.syncGet(keys).then(items => {
        assert(items === loaded);

        assert(chrome.storage.sync.get.calledOnce === true);
        assert(chrome.storage.sync.get.args[0][0] === keys);

        done();
      });
    });
  });

  /** @test {Storage.syncGetValue} */
  describe(".syncGetValue", () => {
    it("returns Promise of loaded value from sync storage", (done) => {
      const key = "foo";
      const loaded = "abc";
      chrome.storage.sync.get.callsArgWithAsync(1, { [key]: loaded });

      storage.syncGetValue(key).then(value => {
        assert(value === loaded);

        assert(chrome.storage.sync.get.calledOnce === true);
        assert(chrome.storage.sync.get.args[0][0] === key);

        done();
      });
    });

    it("returns undefined for missing key", (done) => {
      chrome.storage.sync.get.callsArgWithAsync(1, {});

      storage.syncGetValue("foo").then(value => {
        assert(value === undefined);
        done();
      });
    });
  });

  /** @test {Storage.syncSet} */
  describe(".syncSet", () => {
    it("saves values into sync storage", (done) => {
      const saved = { foo: "abc", bar: 123 };
      chrome.storage.sync.set.callsArgAsync(1);

      storage.syncSet(saved).then(() => {
        assert(chrome.storage.sync.set.calledOnce === true);
        assert(chrome.storage.sync.set.args[0][0] === saved);
        done();
      });
    });
  });

  /** @test {Storage.syncSetValue} */
  describe(".syncSetValue", () => {
    it("saves value into sync storage", (done) => {
      chrome.storage.sync.set.callsArgAsync(1);

      storage.syncSetValue("foo", "abc").then(() => {
        assert(chrome.storage.sync.set.calledOnce === true);
        assert.deepStrictEqual(
          chrome.storage.sync.set.args[0][0],
          { foo: "abc" }
        );
        done();
      });
    });
  });

  /** @test {Storage.syncRemove} */
  describe(".syncRemove", () => {
    it("removes values from sync storage", (done) => {
      const keys = ["foo", "bar"];
      chrome.storage.sync.remove.callsArgAsync(1);

      storage.syncRemove(keys).then(() => {
        assert(chrome.storage.sync.remove.calledOnce === true);
        assert(chrome.storage.sync.remove.args[0][0] === keys);
        done();
      });
    });
  });

  /** @test {Storage.syncClear} */
  describe(".syncClear", () => {
    it("clears all values in sync storage", (done) => {
      chrome.storage.sync.clear.callsArgAsync(0);

      storage.syncClear().then(() => {
        assert(chrome.storage.sync.clear.calledOnce === true);
        done();
      });
    });
  });

  /** @test {Storage.localGet} */
  describe(".localGet", () => {
    it("returns Promise of loaded values from local storage", (done) => {
      const keys = ["foo", "bar"];
      const loaded = { foo: "abc", bar: 123 };
      chrome.storage.local.get.callsArgWithAsync(1, loaded);

      storage.localGet(keys).then(items => {
        assert(items === loaded);

        assert(chrome.storage.local.get.calledOnce === true);
        assert(chrome.storage.local.get.args[0][0] === keys);

        done();
      });
    });
  });

  /** @test {Storage.localGetValue} */
  describe(".localGetValue", () => {
    it("returns Promise of loaded value from local storage", (done) => {
      const key = "foo";
      const loaded = "abc";
      chrome.storage.local.get.callsArgWithAsync(1, { [key]: loaded });

      storage.localGetValue(key).then(value => {
        assert(value === loaded);

        assert(chrome.storage.local.get.calledOnce === true);
        assert(chrome.storage.local.get.args[0][0] === key);

        done();
      });
    });

    it("returns undefined for missing key", (done) => {
      chrome.storage.local.get.callsArgWithAsync(1, {});

      storage.localGetValue("foo").then(value => {
        assert(value === undefined);
        done();
      });
    });
  });

  /** @test {Storage.localSet} */
  describe(".localSet", () => {
    it("saves values into local storage", (done) => {
      const saved = { foo: "abc", bar: 123 };
      chrome.storage.local.set.callsArgAsync(1);

      storage.localSet(saved).then(() => {
        assert(chrome.storage.local.set.calledOnce === true);
        assert(chrome.storage.local.set.args[0][0] === saved);
        done();
      });
    });
  });

  /** @test {Storage.localSetValue} */
  describe(".localSetValue", () => {
    it("saves value into local storage", (done) => {
      chrome.storage.local.set.callsArgAsync(1);

      storage.localSetValue("foo", "abc").then(() => {
        assert(chrome.storage.local.set.calledOnce === true);
        assert.deepStrictEqual(
          chrome.storage.local.set.args[0][0],
          { foo: "abc" }
        );
        done();
      });
    });
  });

  /** @test {Storage.localRemove} */
  describe(".localRemove", () => {
    it("removes values from local storage", (done) => {
      const keys = ["foo", "bar"];
      chrome.storage.local.remove.callsArgAsync(1);

      storage.localRemove(keys).then(() => {
        assert(chrome.storage.local.remove.calledOnce === true);
        assert(chrome.storage.local.remove.args[0][0] === keys);
        done();
      });
    });
  });

  /** @test {Storage.localClear} */
  describe(".localClear", () => {
    it("clears all values in local storage", (done) => {
      chrome.storage.local.clear.callsArgAsync(0);

      storage.localClear().then(() => {
        assert(chrome.storage.local.clear.calledOnce === true);
        done();
      });
    });
  });
});
