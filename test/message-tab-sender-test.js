import "./test-helper";
import MessageTabSender from "../src/message-tab-sender";

/** @test {MessageTabSender} */
describe("MessageTabSender", () => {
  /** @test {MessageTabSender#constructor} */
  describe("#constructor", () => {
    it("defines send methods automatically", () => {
      const sender = new MessageTabSender(["FOO", "BAR"]);
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });

    it("accepts Object for argument", () => {
      const sender = new MessageTabSender({ FOO: "fooval", BAR: "barval" });
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });
  });

  describe("#sendXXX", () => {
    it("sends message via chrome.tabs.sendMessage", (done) => {
      const response = {};
      chrome.tabs.sendMessage.yields(response);

      const sender = new MessageTabSender(["FOO"]);
      sender.sendFoo(123, { a: 1, b: "x" }).then(resolved => {
        assert(resolved === response);

        assert(chrome.tabs.sendMessage.calledOnce === true);
        assert(chrome.tabs.sendMessage.args[0][0] === 123);
        assert.deepEqual(
          chrome.tabs.sendMessage.args[0][1],
          { type: "FOO", a: 1, b: "x" }
        );

        done();
      });
    });

    it("rejects Promise when lastError is set", () => {
      const error = { message: "NG" };
      chrome.runtime.lastError = error;
      chrome.tabs.sendMessage.yields();

      const sender = new MessageTabSender(["FOO"]);
      return assert.rejected(sender.sendFoo(123), rejected => {
        assert(rejected === error);
      });
    });

    it("rejects Promise when response.error is set", () => {
      const response = { error: "NG" };
      chrome.tabs.sendMessage.yields(response);

      const sender = new MessageTabSender(["FOO"]);
      return assert.rejected(sender.sendFoo(123), rejected => {
        assert(rejected === "NG");
      });
    });
  });
});