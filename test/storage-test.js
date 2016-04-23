import "./test-helper";
import storage from "../src/storage";

/** @test {Storage} */
describe("storage", () => {
  /** @test {Storage.syncGet} */
  describe(".syncGet", () => {
    it("returns Promise of loaded values from sync storage", () => {
      const keys = ["foo", "bar"];
      const loaded = { foo: "abc", bar: 123 };
      chrome.storage.sync.get.yieldsAsync(loaded);

      return storage.syncGet(keys).then(items => {
        assert(items === loaded);

        assert(chrome.storage.sync.get.calledOnce === true);
        assert(chrome.storage.sync.get.args[0][0] === keys);
      });
    });
  });

  /** @test {Storage.syncGetValue} */
  describe(".syncGetValue", () => {
    it("returns Promise of loaded value from sync storage", () => {
      const key = "foo";
      const loaded = "abc";
      chrome.storage.sync.get.yieldsAsync({ [key]: loaded });

      return storage.syncGetValue(key).then(value => {
        assert(value === loaded);

        assert(chrome.storage.sync.get.calledOnce === true);
        assert(chrome.storage.sync.get.args[0][0] === key);
      });
    });

    it("returns undefined for missing key", () => {
      chrome.storage.sync.get.yieldsAsync({});

      return storage.syncGetValue("foo").then(value => {
        assert(value === undefined);
      });
    });
  });

  /** @test {Storage.syncSet} */
  describe(".syncSet", () => {
    it("saves values into sync storage", () => {
      const saved = { foo: "abc", bar: 123 };
      chrome.storage.sync.set.yieldsAsync();

      return storage.syncSet(saved).then(() => {
        assert(chrome.storage.sync.set.calledOnce === true);
        assert(chrome.storage.sync.set.args[0][0] === saved);
      });
    });
  });

  /** @test {Storage.syncSetValue} */
  describe(".syncSetValue", () => {
    it("saves value into sync storage", () => {
      chrome.storage.sync.set.yieldsAsync();

      return storage.syncSetValue("foo", "abc").then(() => {
        assert(chrome.storage.sync.set.calledOnce === true);
        assert.deepEqual(
          chrome.storage.sync.set.args[0][0],
          { foo: "abc" }
        );
      });
    });
  });

  /** @test {Storage.syncRemove} */
  describe(".syncRemove", () => {
    it("removes values from sync storage", () => {
      const keys = ["foo", "bar"];
      chrome.storage.sync.remove.yieldsAsync();

      return storage.syncRemove(keys).then(() => {
        assert(chrome.storage.sync.remove.calledOnce === true);
        assert(chrome.storage.sync.remove.args[0][0] === keys);
      });
    });
  });

  /** @test {Storage.syncClear} */
  describe(".syncClear", () => {
    it("clears all values in sync storage", () => {
      chrome.storage.sync.clear.yieldsAsync();

      return storage.syncClear().then(() => {
        assert(chrome.storage.sync.clear.calledOnce === true);
      });
    });
  });

  /** @test {Storage.localGet} */
  describe(".localGet", () => {
    it("returns Promise of loaded values from local storage", () => {
      const keys = ["foo", "bar"];
      const loaded = { foo: "abc", bar: 123 };
      chrome.storage.local.get.yieldsAsync(loaded);

      return storage.localGet(keys).then(items => {
        assert(items === loaded);

        assert(chrome.storage.local.get.calledOnce === true);
        assert(chrome.storage.local.get.args[0][0] === keys);
      });
    });
  });

  /** @test {Storage.localGetValue} */
  describe(".localGetValue", () => {
    it("returns Promise of loaded value from local storage", () => {
      const key = "foo";
      const loaded = "abc";
      chrome.storage.local.get.yieldsAsync({ [key]: loaded });

      return storage.localGetValue(key).then(value => {
        assert(value === loaded);

        assert(chrome.storage.local.get.calledOnce === true);
        assert(chrome.storage.local.get.args[0][0] === key);
      });
    });

    it("returns undefined for missing key", () => {
      chrome.storage.local.get.yieldsAsync({});

      return storage.localGetValue("foo").then(value => {
        assert(value === undefined);
      });
    });
  });

  /** @test {Storage.localSet} */
  describe(".localSet", () => {
    it("saves values into local storage", () => {
      const saved = { foo: "abc", bar: 123 };
      chrome.storage.local.set.yieldsAsync();

      return storage.localSet(saved).then(() => {
        assert(chrome.storage.local.set.calledOnce === true);
        assert(chrome.storage.local.set.args[0][0] === saved);
      });
    });
  });

  /** @test {Storage.localSetValue} */
  describe(".localSetValue", () => {
    it("saves value into local storage", () => {
      chrome.storage.local.set.yieldsAsync();

      return storage.localSetValue("foo", "abc").then(() => {
        assert(chrome.storage.local.set.calledOnce === true);
        assert.deepEqual(
          chrome.storage.local.set.args[0][0],
          { foo: "abc" }
        );
      });
    });
  });

  /** @test {Storage.localRemove} */
  describe(".localRemove", () => {
    it("removes values from local storage", () => {
      const keys = ["foo", "bar"];
      chrome.storage.local.remove.yieldsAsync();

      return storage.localRemove(keys).then(() => {
        assert(chrome.storage.local.remove.calledOnce === true);
        assert(chrome.storage.local.remove.args[0][0] === keys);
      });
    });
  });

  /** @test {Storage.localClear} */
  describe(".localClear", () => {
    it("clears all values in local storage", () => {
      chrome.storage.local.clear.yieldsAsync();

      return storage.localClear().then(() => {
        assert(chrome.storage.local.clear.calledOnce === true);
      });
    });
  });
});
