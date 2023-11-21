import serial from "../util/serial";
import { Rule } from "./types";
import { v4 } from "uuid";

export class Event<H extends Function> {
  private listeners: Set<H>;
  private rules: Rule<true>[];

  constructor(eventName: string) {
    this.listeners = new Set();
    this.rules = [];

    serial.on(eventName, (...args: any[]) => {
      this.listeners.forEach((listener) => listener(...args));
    });
  }

  addListener(callback: H) {
    this.listeners.add(callback);
  }

  addRules(rules: Rule[], callback?: (rules: Rule<true>[]) => void) {
    const updatedRules = rules.map((rule) => {
      if (!rule.id) {
        rule.id = v4();
      }

      return rule as Rule<true>;
    });

    this.rules.push(...updatedRules);

    if (typeof callback === "function") {
      callback(updatedRules);
    }
  }

  getRules(
    ruleIdentifiers: string[] | undefined,
    callback: (rules: Rule<true>[]) => void
  ): void {
    if (ruleIdentifiers) {
      callback(
        this.rules.filter(
          (rule) => rule.id && ruleIdentifiers.includes(rule.id)
        )
      );
    } else {
      callback(this.rules);
    }
  }

  hasListener(callback: H): boolean {
    return this.listeners.has(callback);
  }

  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  removeListener(callback: H): void {
    this.listeners.delete(callback);
  }

  removeRules(ruleIdentifiers: string[], callback?: () => void): void {
    this.rules = this.rules.filter(
      (rule) => !rule.id || !ruleIdentifiers.includes(rule.id)
    );

    if (typeof callback === "function") {
      callback();
    }
  }
}
