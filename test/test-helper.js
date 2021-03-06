import assert from "assert";
import sinon from "sinon";
import sinonChrome from "sinon-chrome";

assert.rejected = (promise, tester) => {
  return promise.then(
    resolved => {
      assert(false, `Promise expected to be rejected is resolved with ${resolved}`);
    },
    rejected => {
      if (tester) tester(rejected);
    }
  );
};

global.assert = assert;
global.sinon = sinon;
global.chrome = sinonChrome;

afterEach(() => {
  global.chrome.flush();
});
