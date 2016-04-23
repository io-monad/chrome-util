import "./test-helper";
import MessageSender from "../src/message-sender";

/** @test {MessageSender} */
describe("MessageSender", () => {
  /** @test {MessageSender#constructor} */
  describe("#constructor", () => {
    it("defines send methods automatically", () => {
      const sender = new MessageSender(["FOO", "BAR"]);
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });

    it("accepts Object for argument", () => {
      const sender = new MessageSender({ FOO: "fooval", BAR: "barval" });
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });
  });

  describe("#sendXXX", () => {
    it("sends message via chrome.runtime.sendMessage", () => {
      const response = {};
      chrome.runtime.sendMessage.yields(response);

      const sender = new MessageSender(["FOO"]);
      return sender.sendFoo({ a: 1, b: "x" }).then(resolved => {
        assert(resolved === response);

        assert(chrome.runtime.sendMessage.calledOnce === true);
        assert.deepEqual(
          chrome.runtime.sendMessage.args[0][0],
          { type: "FOO", a: 1, b: "x" }
        );
      });
    });

    it("rejects Promise when lastError is set", () => {
      const error = { message: "NG" };
      chrome.runtime.lastError = error;
      chrome.runtime.sendMessage.yields();

      const sender = new MessageSender(["FOO"]);
      return assert.rejected(sender.sendFoo(), rejected => {
        assert(rejected === error);
      });
    });

    it("rejects Promise when response.error is set", () => {
      const response = { error: "NG" };
      chrome.runtime.sendMessage.yields(response);

      const sender = new MessageSender(["FOO"]);
      return assert.rejected(sender.sendFoo(), rejected => {
        assert(rejected === "NG");
      });
    });
  });
});
