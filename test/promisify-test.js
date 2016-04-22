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

  it("returns rejected Promise for chrome.runtime.lastError", (done) => {
    const error = { message: "Test error" };
    const asyncFunction = (callback) => {
      setImmediate(() => {
        chrome.runtime.lastError = error;
        callback();
      });
    };

    promisify(cb => asyncFunction(cb)).catch(ret => {
      assert(ret === error);
      done();
    });
  });
});
