import "./test-helper";
import translateMessage from "../src/translate-message";

/** @test {translateMessage} */
describe("translateMessage", () => {
  it("translates all keys in message", () => {
    chrome.i18n.getMessage.withArgs("foo").returns("test1");
    chrome.i18n.getMessage.withArgs("bar").returns("test2");

    const translated = translateMessage(
      "This is __MSG_foo__ and __MSG_bar__ message."
    );
    assert(translated === "This is test1 and test2 message.");
  });

  it("warns missing key", () => {
    chrome.i18n.getMessage.withArgs("foo").returns("test1");
    chrome.i18n.getMessage.withArgs("bar").returns("");

    const stubWarn = sinon.stub(console, "warn");
    const translated = translateMessage(
      "This is __MSG_foo__ and __MSG_bar__ message."
    );
    stubWarn.restore();

    assert(translated === "This is test1 and  message.");

    assert(stubWarn.calledOnce === true);
    assert(stubWarn.args[0][0] === "No translation for \"__MSG_bar__\"");
  });
});
