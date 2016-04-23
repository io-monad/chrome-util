import "./test-helper";
import Alarm from "../src/alarm";

/** @test {Alarm} */
describe("Alarm", () => {
  let alarm;

  beforeEach(() => {
    alarm = new Alarm("test");
  });

  /** @test {Alarm#start} */
  describe("#start", () => {
    it("calls chrome.alarms.create", () => {
      const alarmInfo = { delayInMinutes: 5 };
      alarm.start(alarmInfo);

      assert(chrome.alarms.create.calledOnce === true);

      const args = chrome.alarms.create.args[0];
      assert(args[0] === "test");
      assert(args[1] === alarmInfo);
    });
  });

  /** @test {Alarm#stop} */
  describe("#stop", () => {
    it("calls chrome.alarms.clear with Promise", (done) => {
      chrome.alarms.clear.yields(true);
      alarm.stop().then(ret => {
        assert(ret === true);
        assert(chrome.alarms.clear.calledOnce === true);
        assert(chrome.alarms.clear.args[0][0] === "test");
        done();
      });
    });
  });

  context("onAlarm event", () => {
    it("emits alarm event for chrome.alarms.onAlarm event", (done) => {
      alarm.on("alarm", given => {
        assert(given === alarm);
        done();
      });
      chrome.alarms.onAlarm.trigger({ name: alarm.name });
    });

    it("ignores chrome.alarms.onAlarm event with different name", () => {
      alarm.on("alarm", () => { assert(false); });
      chrome.alarms.onAlarm.trigger({ name: "different" });
    });
  });
});
