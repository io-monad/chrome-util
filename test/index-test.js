import "./test-helper";
import ChromeUtil from "../src/index";

/** @test {ChromeUtil} */
describe("ChromeUtil", () => {
  /** @test {ChromeUtil.Alarm} **/
  describe(".Alarm", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.Alarm === "function");
    });
  });

  /** @test {ChromeUtil.getVersion} **/
  describe(".getVersion", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.getVersion === "function");
    });
  });

  /** @test {ChromeUtil.MessageReceiver} **/
  describe(".MessageReceiver", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.MessageReceiver === "function");
    });
  });

  /** @test {ChromeUtil.MessageSender} **/
  describe(".MessageSender", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.MessageSender === "function");
    });
  });

  /** @test {ChromeUtil.MessageTabSender} **/
  describe(".MessageTabSender", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.MessageTabSender === "function");
    });
  });

  /** @test {ChromeUtil.openOptionsPage} **/
  describe(".openOptionsPage", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.openOptionsPage === "function");
    });
  });

  /** @test {ChromeUtil.openStorePage} **/
  describe(".openStorePage", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.openStorePage === "function");
    });
  });

  /** @test {ChromeUtil.promisify} **/
  describe(".promisify", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.promisify === "function");
    });
  });

  /** @test {ChromeUtil.SandboxReceiver} **/
  describe(".SandboxReceiver", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.SandboxReceiver === "function");
    });
  });

  /** @test {ChromeUtil.SandboxSender} **/
  describe(".SandboxSender", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.SandboxSender === "function");
    });
  });

  /** @test {ChromeUtil.storage} **/
  describe(".storage", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.storage === "function");
    });
  });

  /** @test {ChromeUtil.tabs} **/
  describe(".tabs", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.tabs === "function");
    });
  });

  /** @test {ChromeUtil.translateMessage} **/
  describe(".translateMessage", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.translateMessage === "function");
    });
  });

  /** @test {ChromeUtil.translate} **/
  describe(".translate", () => {
    it("returns loaded module", () => {
      assert(typeof ChromeUtil.translate === "function");
    });
  });
});
