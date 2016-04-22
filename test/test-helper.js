import assert from "assert";
import sinon from "sinon";
import sinonChrome from "sinon-chrome";

global.assert = assert;
global.sinon = sinon;
global.chrome = sinonChrome;

afterEach(() => {
  global.chrome.flush();
});
