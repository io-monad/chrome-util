import "./test-helper";
import _ from "lodash";
import SandboxReceiver from "../src/sandbox-receiver";

/** @test {SandboxReceiver} */
describe("SandboxReceiver", () => {
  class TestSandboxMessenger {
    constructor() {
      this.receiver = new SandboxReceiver({
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
      // Empty response will be returned automatically
    }
  }

  if (typeof window === "undefined") {
    require("mocha-jsdom")();
  }

  let stubAddEventListener;
  let receiverHandler;
  let messenger;

  beforeEach(() => {
    stubAddEventListener = sinon.stub(window, "addEventListener", (type, handler) => {
      assert(type === "message" && _.isFunction(handler));
      receiverHandler = handler;
    });
    messenger = new TestSandboxMessenger();
  });

  afterEach(() => {
    stubAddEventListener.restore();
  });

  function receiveMessageSync(message) {
    let response;
    receiverHandler({
      data: message,
      origin: "*",
      source: { postMessage: (msg) => { response = msg; } },
    });
    return response;
  }

  function receiveMessage(message) {
    return new Promise(resolve => {
      receiverHandler({
        data: message,
        origin: "*",
        source: { postMessage: (response) => resolve(response) },
      });
    });
  }

  it("dispatches message to handler that returns a value", () => {
    const message = { type: "VALUE", requestId: 1 };

    const response = receiveMessageSync(message);
    assert.deepEqual(response, { requestId: 1, response: "OK" });

    assert(messenger.spyValue.calledOnce);
    assert(messenger.spyValue.thisValues[0] === messenger);
    assert(messenger.spyValue.args[0][0] === message);
  });

  it("dispatches message to handler that returns resolved Promise", () => {
    const message = { type: "PROMISE", requestId: 1 };

    return receiveMessage(message).then(response => {
      assert.deepEqual(response, { requestId: 1, response: "OK" });

      assert(messenger.spyPromise.calledOnce);
      assert(messenger.spyPromise.thisValues[0] === messenger);
      assert(messenger.spyPromise.args[0][0] === message);
    });
  });

  it("dispatches message to handler that returns rejected Promise", () => {
    const message = { type: "REJECTED", requestId: 1 };

    return receiveMessage(message).then(response => {
      assert.deepEqual(response, {
        requestId: 1,
        response: { error: "NG" },
      });

      assert(messenger.spyRejected.calledOnce);
      assert(messenger.spyRejected.thisValues[0] === messenger);
      assert(messenger.spyRejected.args[0][0] === message);
    });
  });

  it("dispatched message to handler that returns no response", () => {
    const message = { type: "NO_RESPONSE", requestId: 1 };

    const response = receiveMessageSync(message);
    assert.deepEqual(response, { requestId: 1, response: null });

    assert(messenger.spyNoResponse.calledOnce);
    assert(messenger.spyNoResponse.thisValues[0] === messenger);
    assert(messenger.spyNoResponse.args[0][0] === message);
  });

  it("does not respond to invalid messages with warning log", () => {
    const message = { foo: "BAR", requestId: 1 };

    const stubWarn = sinon.stub(console, "warn");
    const response = receiveMessageSync(message);
    stubWarn.restore();

    assert(response === undefined);
    assert(stubWarn.calledOnce === true);
    assert(stubWarn.args[0][0] === "Unknown message format received");
  });

  it("does not respond to unknown message type", () => {
    const message = { type: "NOHANDLER", requestId: 1 };

    const stubWarn = sinon.stub(console, "warn");
    const response = receiveMessageSync(message);
    stubWarn.restore();

    assert(response === undefined);
    assert(stubWarn.called === false);
  });
});
