import { Event } from "../events";
import serial from "../util/serial";
import { v4 } from "uuid";

export class Port {
  private id: string;
  name: string;
  onDisconnect: Event<(port: Port) => void>;
  onMessage: Event<(message: any, port: Port) => void>;

  constructor(name: string) {
    this.id = v4();
    this.name = name;
    this.onDisconnect = new Event(`runtime.onDisconnect:${this.id}`);
    this.onMessage = new Event(`runtime.onMessage:${this.id}`);
  }

  disconnect() {
    serial.emit(`runtime.disconnect:${this.id}`, this);
  }

  postMessage(message: any) {
    serial.emit(`runtime.message:${this.id}`, message, this);
  }
}
