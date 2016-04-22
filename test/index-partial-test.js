import "./test-helper";
import { getVersion, openOptionsPage } from "../src/index";

describe("ChromeUtil partial import", () => {
  it("can import functions partially", () => {
    assert(typeof getVersion === "function");
    assert(typeof openOptionsPage === "function");
  });
});
