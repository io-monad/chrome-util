import "./test-helper";
import MessageReceiver from "../src/message-receiver";

/** @test {MessageReceiver} */
describe("MessageReceiver", () => {
  class TestMessenger {
    constructor() {
      this.receiver = new MessageReceiver({
        SYNC: this.spySync = sinon.spy(this.handleSync),
        ASYNC: this.spyAsync = sinon.spy(this.handleAsync),
        PROMISE: this.spyPromise = sinon.spy(this.handlePromise),
        REJECTED: this.spyRejected = sinon.spy(this.handleRejected),
      }, this);
    }
    handleSync(message, sender, sendResponse) {
      sendResponse("OK");
      return false;
    }
    handleAsync(message, sender, sendResponse) {
      setImmediate(() => sendResponse("OK"));
      return true;
    }
    handlePromise() {
      return Promise.resolve("OK");
    }
    handleRejected() {
      return Promise.reject(new Error("NG"));
    }
  }

  let messenger;
  let receiver;

  beforeEach(() => {
    messenger = new TestMessenger();
    receiver = messenger.receiver;
  });

  /** @test {MessageReceiver#receive} */
  describe("#receive", () => {
    it("dispatches message to sync handler", () => {
      const message = { type: "SYNC" };
      const sender = {};
      const sendResponse = sinon.spy();

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === false);

      assert(sendResponse.calledOnce === true);  // Synchronous
      assert(sendResponse.args[0][0] === "OK");

      assert(messenger.spySync.calledOnce);
      assert(messenger.spySync.thisValues[0] === messenger);
      assert(messenger.spySync.args[0][0] === message);
      assert(messenger.spySync.args[0][1] === sender);
      assert(messenger.spySync.args[0][2] === sendResponse);
    });

    it("dispatches message to async handler", (done) => {
      const message = { type: "ASYNC" };
      const sender = {};
      const sendResponse = sinon.spy((res) => {
        assert(res === "OK");
        done();
      });

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === true);

      assert(sendResponse.calledOnce === false);  // Asynchronous

      assert(messenger.spyAsync.calledOnce);
      assert(messenger.spyAsync.thisValues[0] === messenger);
      assert(messenger.spyAsync.args[0][0] === message);
      assert(messenger.spyAsync.args[0][1] === sender);
      assert(messenger.spyAsync.args[0][2] === sendResponse);
    });

    it("dispatches message to promise handler", (done) => {
      const message = { type: "PROMISE" };
      const sender = {};
      const sendResponse = sinon.spy((res) => {
        assert(res === "OK");
        done();
      });

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === true);

      assert(sendResponse.calledOnce === false);  // Asynchronous

      assert(messenger.spyPromise.calledOnce);
      assert(messenger.spyPromise.thisValues[0] === messenger);
      assert(messenger.spyPromise.args[0][0] === message);
      assert(messenger.spyPromise.args[0][1] === sender);
      assert(messenger.spyPromise.args[0][2] === sendResponse);
    });

    it("handles rejected Promise to send error response", (done) => {
      const message = { type: "REJECTED" };
      const sender = {};
      const sendResponse = sinon.spy((res) => {
        assert(typeof res === "object");
        assert(res.error === "NG");
        done();
      });

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === true);

      assert(sendResponse.calledOnce === false);  // Asynchronous

      assert(messenger.spyRejected.calledOnce);
      assert(messenger.spyRejected.thisValues[0] === messenger);
      assert(messenger.spyRejected.args[0][0] === message);
      assert(messenger.spyRejected.args[0][1] === sender);
      assert(messenger.spyRejected.args[0][2] === sendResponse);
    });

    it("does not respond to invalid messages with warning log", () => {
      const message = { foo: "BAR" };
      const sender = {};
      const sendResponse = sinon.spy(() => { assert(false); });

      const stubWarn = sinon.stub(console, "warn");
      const ret = receiver.receive(message, sender, sendResponse);
      stubWarn.restore();

      assert(ret === false);
      assert(sendResponse.called === false);

      assert(stubWarn.calledOnce === true);
      assert(stubWarn.args[0][0] === "Unknown message format received");
    });

    it("does not respond to unknown message type", () => {
      const message = { type: "NOHANDLER" };
      const sender = {};
      const sendResponse = sinon.spy(() => { assert(false); });

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === false);
      assert(sendResponse.called === false);
    });
  });

  /** @test {MessageReceiver#listener} */
  describe("#listener", () => {
    it("is bound version of #receive", () => {
      const message = { type: "SYNC" };
      const sender = {};
      const sendResponse = sinon.spy();

      const ret = receiver.listener.call(null, message, sender, sendResponse);
      assert(ret === false);

      assert(sendResponse.calledOnce === true);  // Synchronous
      assert(sendResponse.args[0][0] === "OK");

      assert(messenger.spySync.calledOnce);
      assert(messenger.spySync.thisValues[0] === messenger);
      assert(messenger.spySync.args[0][0] === message);
      assert(messenger.spySync.args[0][1] === sender);
      assert(messenger.spySync.args[0][2] === sendResponse);
    });
  });
});
