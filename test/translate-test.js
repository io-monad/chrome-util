import "./test-helper";
import translate from "../src/translate";

/** @test {translate} */
describe("translate", () => {
  it("returns translation for given key", () => {
    chrome.i18n.getMessage.returns("test");
    assert(translate("foo") === "test");
    assert(chrome.i18n.getMessage.calledOnce === true);
    assert(chrome.i18n.getMessage.args[0][0] === "foo");
  });

  it("uses camel case version of given key", () => {
    chrome.i18n.getMessage.returns("test");
    assert(translate("foo bar baz") === "test");
    assert(chrome.i18n.getMessage.calledOnce === true);
    assert(chrome.i18n.getMessage.args[0][0] === "fooBarBaz");
  });

  it("returns fallback for missing key", () => {
    chrome.i18n.getMessage.returns("");
    assert(translate("foo", "fallback") === "fallback");
    assert(chrome.i18n.getMessage.calledOnce === true);
    assert(chrome.i18n.getMessage.args[0][0] === "foo");
  });

  it("never returns fallback for existing key", () => {
    chrome.i18n.getMessage.returns("test");
    assert(translate("foo", "fallback") === "test");
    assert(chrome.i18n.getMessage.calledOnce === true);
    assert(chrome.i18n.getMessage.args[0][0] === "foo");
  });

  it("passes substitutions to chrome.i18n.getMessage", () => {
    const substitutions = ["bar"];
    chrome.i18n.getMessage.returns("test");

    assert(translate("foo", substitutions, "fallback") === "test");
    assert(chrome.i18n.getMessage.calledOnce === true);
    assert(chrome.i18n.getMessage.args[0][0] === "foo");
    assert(chrome.i18n.getMessage.args[0][1] === substitutions);
  });

  it("warns missing key without fallback", () => {
    chrome.i18n.getMessage.returns("");

    const stubWarn = sinon.stub(console, "warn");
    assert(translate("foo") === "");
    stubWarn.restore();

    assert(stubWarn.calledOnce === true);
    assert(stubWarn.args[0][0] === "No translation for \"foo\"");
  });
});
