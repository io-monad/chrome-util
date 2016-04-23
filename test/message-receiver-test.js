import "./test-helper";
import MessageReceiver from "../src/message-receiver";

/** @test {MessageReceiver} */
describe("MessageReceiver", () => {
  class TestMessenger {
    constructor() {
      this.receiver = new MessageReceiver({
        VALUE: this.spyValue = sinon.spy(this.handleValue),
        PROMISE: this.spyPromise = sinon.spy(this.handlePromise),
        REJECTED: this.spyRejected = sinon.spy(this.handleRejected),
        NO_RESPONSE: this.spyNoResponse = sinon.spy(this.handleNoResponse),
      }, this);
    }
    handleValue() {
      return "OK";
    }
    handlePromise() {
      return Promise.resolve("OK");
    }
    handleRejected() {
      return Promise.reject(new Error("NG"));
    }
    handleNoResponse() {
      // Empty response
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
    it("dispatches message to handler that returns a value", () => {
      const message = { type: "VALUE" };
      const sender = {};
      const sendResponse = sinon.spy();

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === false);

      assert(sendResponse.calledOnce === true);  // Synchronous
      assert(sendResponse.args[0][0] === "OK");

      assert(messenger.spyValue.calledOnce);
      assert(messenger.spyValue.thisValues[0] === messenger);
      assert(messenger.spyValue.args[0][0] === message);
      assert(messenger.spyValue.args[0][1] === sender);
    });

    it("dispatches message to handler that returns resolved Promise", (done) => {
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
    });

    it("dispatches message to handler that returns rejected Promise", (done) => {
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
    });

    it("dispatches message to handler that returns no response", () => {
      const message = { type: "NO_RESPONSE" };
      const sender = {};
      const sendResponse = sinon.spy();

      const ret = receiver.receive(message, sender, sendResponse);
      assert(ret === false);

      assert(sendResponse.calledOnce === true);  // Synchronous
      assert(sendResponse.args[0][0] === undefined);

      assert(messenger.spyNoResponse.calledOnce);
      assert(messenger.spyNoResponse.thisValues[0] === messenger);
      assert(messenger.spyNoResponse.args[0][0] === message);
      assert(messenger.spyNoResponse.args[0][1] === sender);
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
      const message = { type: "VALUE" };
      const sender = {};
      const sendResponse = sinon.spy();

      const ret = receiver.listener.call(null, message, sender, sendResponse);
      assert(ret === false);

      assert(sendResponse.calledOnce === true);  // Synchronous
      assert(sendResponse.args[0][0] === "OK");

      assert(messenger.spyValue.calledOnce);
      assert(messenger.spyValue.thisValues[0] === messenger);
      assert(messenger.spyValue.args[0][0] === message);
      assert(messenger.spyValue.args[0][1] === sender);
    });
  });
});
