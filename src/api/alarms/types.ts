export type Alarm = {
  name: string;
  periodInMinutes?: number;
  scheduledTime: number;
};

export type AlarmCreateInfo = {
  delayInMinutes?: number;
  periodInMinutes?: number;
  when?: number;
};
