import "./test-helper";
import promisify from "../src/promisify";

/** @test {promisify} */
describe("promisify", () => {
  it("returns Promise version of async function", (done) => {
    const asyncFunction = (callback) => {
      setImmediate(() => { callback("OK"); });
    };

    promisify(cb => asyncFunction(cb)).then(ret => {
      assert(ret === "OK");
      done();
    });
  });

  it("returns rejected Promise for chrome.runtime.lastError", () => {
    const error = { message: "Test error" };
    const asyncFunction = (callback) => {
      setImmediate(() => {
        chrome.runtime.lastError = error;
        callback();
      });
    };

    const promise = promisify(cb => asyncFunction(cb));
    return assert.rejected(promise, rejected => {
      assert(rejected === error);
    });
  });

  it("returns rejected Promise when error is passed", () => {
    const asyncFunction = (callback) => {
      setImmediate(() => { callback(null, "NG"); });
    };

    const promise = promisify(cb => asyncFunction(cb));
    return assert.rejected(promise, rejected => {
      assert(rejected === "NG");
    });
  });
});
