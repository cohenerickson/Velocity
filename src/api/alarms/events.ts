import { Event } from "../events";
import { Alarm } from "./types";

export const onAlarm = new Event<(alarm: Alarm) => void>("alarms.onAlarm");
