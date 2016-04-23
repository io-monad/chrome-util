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
  handleHello(message) {
    return `Hello, ${message.name}!`;
  }
  handleWait(message) {
    return new Promise(resolve => {
      setTimeout(() => { resolve({ waited: true }); }, message.wait);
    });
  }
  handleEcho(message) {
    return Promise.resolve(message);
  }
  handleFail() {
    return Promise.reject("FAILED!");
  }
}

window.receiver = new E2ETestSandboxReceiver;
