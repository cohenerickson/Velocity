import EventManager from "../types/EventManager";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";

const Alarms = new Array<Alarm>();

type Alarm = {
  name: string;
  periodInMinutes?: number;
  scheduledTime: number;
};

type AlarmCreateInfo = {
  delayInMinutes?: number;
  periodInMinutes?: number;
  when?: number;
};

export const clear = callbackWrapper($clear);

async function $clear(name: string = ""): Promise<boolean> {
  const alarm = Alarms.find((x) => x.name === name);

  if (alarm) {
    Alarms.splice(Alarms.indexOf(alarm), 1);

    return true;
  } else {
    return false;
  }
}

export const clearAll = callbackWrapper($clearAll);

async function $clearAll(): Promise<boolean> {
  Alarms.splice(0, Alarms.length);

  return Alarms.length === 0;
}

export const create = callbackWrapper($create);

async function $create(
  name: string = "",
  alarmInfo: AlarmCreateInfo
): Promise<void> {
  const alarm: Alarm = {
    name,
    periodInMinutes: alarmInfo.periodInMinutes,
    scheduledTime: alarmInfo.delayInMinutes
      ? Date.now() + alarmInfo.delayInMinutes * 1000
      : alarmInfo.when
      ? Date.now() + alarmInfo.when
      : Date.now()
  };

  Alarms.push(alarm);

  bindingUtil.on("alarms.onAlarm", (eventAlarm: Alarm) => {
    if (eventAlarm === alarm) {
      if (alarm.periodInMinutes) {
        setTimeout(() => {
          if (Alarms.includes(alarm)) {
            bindingUtil.emit("alarms.onAlarm", alarm);
          }
        }, alarm.periodInMinutes * 1000);
      }
    }
  });

  setTimeout(() => {
    if (Alarms.includes(alarm)) {
      bindingUtil.emit("alarms.onAlarm", alarm);
    }
  }, alarm.scheduledTime - Date.now());
}

export const get = callbackWrapper($get);

async function $get(name: string = ""): Promise<Alarm | undefined> {
  return Alarms.find((x) => x.name === name);
}

export const getAll = callbackWrapper($getAll);

async function $getAll(): Promise<Alarm[]> {
  return Alarms;
}

export const onAlarm = new EventManager("alarms.onAlarm");
