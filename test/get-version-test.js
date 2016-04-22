import "./test-helper";
import getVersion from "../src/get-version";

/** @test {getVersion} */
describe("getVersion", () => {
  it("returns version string from manifest", () => {
    const manifest = { version: "1.2.3" };
    chrome.runtime.getManifest.returns(manifest);

    assert(getVersion() === "1.2.3");
  });
});
