import "./test-helper";
import _ from "lodash";
import SandboxSender from "../src/sandbox-sender";

/** @test {SandboxSender} */
describe("SandboxSender", () => {
  let responseHandler;
  let iframe;
  let sinonSandbox;

  beforeEach(() => {
    global.window = {
      addEventListener: (type, handler) => {
        assert(type === "message" && _.isFunction(handler));
        responseHandler = handler;
      },
    };
    iframe = { contentWindow: { postMessage: () => {} } };
    sinonSandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    delete global.window;
    sinonSandbox.restore();
  });

  function setSandboxResponse(response) {
    sinon.stub(iframe.contentWindow, "postMessage", (message, origin) => {
      setImmediate(() => {
        responseHandler({
          data: { requestId: message.requestId, response },
          origin,
        });
      });
    });
  }

  /** @test {SandboxSender#constructor} */
  describe("#constructor", () => {
    it("defines send methods automatically", () => {
      const sender = new SandboxSender(iframe, ["FOO", "BAR"]);
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });

    it("accepts Object for argument", () => {
      const sender = new SandboxSender(iframe, { FOO: "fooval", BAR: "barval" });
      assert(typeof sender.sendFoo === "function");
      assert(typeof sender.sendBar === "function");

      assert(typeof sender.sendUnknown === "undefined");
    });
  });

  describe("#sendXXX", () => {
    it("sends message via postMessage", () => {
      const response = { hello: "world" };
      setSandboxResponse(response);

      const sender = new SandboxSender(iframe, ["FOO"]);
      return sender.sendFoo({ a: 1, b: "x" }).then(resolved => {
        assert.deepStrictEqual(resolved, response);
        assert(iframe.contentWindow.postMessage.calledOnce === true);
        assert.deepStrictEqual(
          iframe.contentWindow.postMessage.args[0],
          [{ type: "FOO", requestId: 1, a: 1, b: "x" }, "*"]
        );
      });
    });

    it("rejects Promise when response.error is set", () => {
      const response = { error: "NG" };
      setSandboxResponse(response);

      const sender = new SandboxSender(iframe, ["FOO"]);
      return assert.rejected(sender.sendFoo(), rejected => {
        assert(rejected === "NG");
      });
    });

    it("rejects Promise when response has timed out", () => {
      const clock = sinonSandbox.useFakeTimers();
      const lodash = _.runInContext();
      sinonSandbox.stub(_, "now", lodash.now);
      sinonSandbox.stub(_, "debounce", lodash.debounce);

      const sender = new SandboxSender(iframe, ["FOO"], { timeout: 5000 });
      const promise = sender.sendFoo();
      clock.tick(5000);

      return assert.rejected(promise, rejected => {
        assert(rejected === "Request has timed out after 5000ms");
      });
    });
  });
});
