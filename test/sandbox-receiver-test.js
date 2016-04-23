import "./test-helper";
import _ from "lodash";
import SandboxReceiver from "../src/sandbox-receiver";

/** @test {SandboxReceiver} */
describe("SandboxReceiver", () => {
  class TestSandboxMessenger {
    constructor() {
      this.receiver = new SandboxReceiver({
        SYNC: this.spySync = sinon.spy(this.handleSync),
        ASYNC: this.spyAsync = sinon.spy(this.handleAsync),
        PROMISE: this.spyPromise = sinon.spy(this.handlePromise),
        REJECTED: this.spyRejected = sinon.spy(this.handleRejected),
        NO_RESPONSE: this.spyNoResponse = sinon.spy(this.handleNoResponse),
      }, this);
    }
    handleSync(message, sendResponse) {
      sendResponse("OK");
      return false;
    }
    handleAsync(message, sendResponse) {
      setImmediate(() => sendResponse("OK"));
      return true;
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

  it("dispatches message to sync handler", () => {
    const message = { type: "SYNC", requestId: 1 };

    const response = receiveMessageSync(message);
    assert.deepEqual(response, { requestId: 1, response: "OK" });

    assert(messenger.spySync.calledOnce);
    assert(messenger.spySync.thisValues[0] === messenger);
    assert(messenger.spySync.args[0][0] === message);
  });

  it("dispatches message to async handler", () => {
    const message = { type: "ASYNC", requestId: 1 };

    return receiveMessage(message).then(response => {
      assert.deepEqual(response, { requestId: 1, response: "OK" });

      assert(messenger.spyAsync.calledOnce);
      assert(messenger.spyAsync.thisValues[0] === messenger);
      assert(messenger.spyAsync.args[0][0] === message);
    });
  });

  it("dispatches message to promise handler", () => {
    const message = { type: "PROMISE", requestId: 1 };

    return receiveMessage(message).then(response => {
      assert.deepEqual(response, { requestId: 1, response: "OK" });

      assert(messenger.spyPromise.calledOnce);
      assert(messenger.spyPromise.thisValues[0] === messenger);
      assert(messenger.spyPromise.args[0][0] === message);
    });
  });

  it("handles rejected Promise to send error response", () => {
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

  it("responds automatically when handler returned nothing", () => {
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
