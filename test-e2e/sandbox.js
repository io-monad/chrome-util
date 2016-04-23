import assert from "assert";
import SandboxSender from "../src/sandbox-sender";

describe("Sandbox communication", () => {
  let iframe;
  before(done => {
    iframe = document.createElement("iframe");
    iframe.src = "/base/test-e2e/sandbox/sandbox.html";
    iframe.onload = () => done();
    document.body.appendChild(iframe);
  });
  after(() => {
    document.body.removeChild(iframe);
    iframe = null;
  });

  let sender;
  beforeEach(() => {
    sender = new SandboxSender(iframe, ["HELLO", "WAIT", "ECHO", "FAIL"]);
  });

  it("can send HELLO message to sandbox", () => {
    return sender.sendHello({ name: "Monad" }).then(response => {
      assert(response === "Hello, Monad!");
    });
  });

  it("can send WAIT message to sandbox", () => {
    const start = Date.now();
    return sender.sendWait({ wait: 30 }).then(response => {
      const elapsed = Date.now() - start;
      assert(elapsed >= 30);
      assert(response.waited === true);
    });
  });

  it("can send ECHO message to sandbox", () => {
    return sender.sendEcho({ foo: "bar", abc: 123 }).then(response => {
      assert.deepEqual(response, { type: "ECHO", requestId: 1, foo: "bar", abc: 123 });
    });
  });

  it("can send FAIL message to sandbox", () => {
    return sender.sendFail().then(
      () => { assert(false, "should be rejected"); },
      err => { assert(err === "FAILED!"); }
    );
  });
});
