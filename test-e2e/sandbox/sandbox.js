import SandboxReceiver from "../../src/sandbox-receiver";

class E2ETestSandboxReceiver {
  constructor() {
    this.receiver = new SandboxReceiver({
      HELLO: this.handleHello,
      WAIT: this.handleWait,
      ECHO: this.handleEcho,
      FAIL: this.handleFail,
    }, this);
  }
  handleHello(message, sendResponse) {
    sendResponse(`Hello, ${message.name}!`);
  }
  handleWait(message, sendResponse) {
    setTimeout(() => { sendResponse({ waited: true }); }, message.wait);
    return true;
  }
  handleEcho(message) {
    return Promise.resolve(message);
  }
  handleFail() {
    return Promise.reject("FAILED!");
  }
}

window.receiver = new E2ETestSandboxReceiver;
