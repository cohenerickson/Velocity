import serial from "../util/serial";
import { LanguageCode } from "./types";
import { loadModule } from "cld3-asm";

const cldFactory = await loadModule();
const messages = await serial.call<
  Record<
    string,
    {
      message: string;
      description: string;
      placeholders?: { content: string; example: string }[];
    }
  >
>("extension.getMessages");

type Result = {
  isReliable: boolean;
  languages: { language: LanguageCode; percentage: number }[];
};

export function detectLanguage(text: string): Promise<Result>;
export function detectLanguage(
  text: string,
  callback?: (result: Result) => void
): void;
export function detectLanguage(
  text: string,
  callback?: (result: Result) => void
): Promise<Result> | void {
  const identifier = cldFactory.create(0, text.length);

  const result = identifier.findMostFrequentLanguages(text, 100);

  const returnVal = {
    isReliable: result[0].is_reliable,
    languages: result.map((x: any) => ({
      language: x.language,
      percentage: x.proportion * 100
    }))
  };

  if (callback) {
    callback(returnVal);
  } else {
    return Promise.resolve(returnVal);
  }
}

export function getAcceptLanguages(): Promise<LanguageCode[]>;
export function getAcceptLanguages(
  callback: (languages: LanguageCode[]) => void
): void;
export function getAcceptLanguages(
  callback?: (languages: LanguageCode[]) => void
): Promise<LanguageCode[]> | void {
  const languages = navigator.languages.map((x) => x.replace(/-.+$/, ""));
  if (callback) {
    callback(languages);
  } else {
    return Promise.resolve(languages);
  }
}

export function getMessage(
  messageName: string,
  substitutions?: string | string[],
  options?: {
    escapeLt?: boolean;
  }
) {
  const message = messages[messageName];

  if (!message) {
    throw new Error(`Message ${messageName} not found.`);
  }

  let msg = message.message;

  if (options?.escapeLt) {
    msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (message.placeholders) {
    Object.entries(message.placeholders).forEach(([key, value]) => {
      msg = msg.replace(new RegExp(`\\$${key}$`, "gi"), value.content);
    });
  }

  if (substitutions) {
    if (typeof substitutions === "string") {
      substitutions = [substitutions];
    }

    for (let i = 0; i < substitutions.length; i++) {
      msg = msg.replace(new RegExp(`\\$${i + 1}`, "gi"), substitutions[i]);
    }
  }

  return msg;
}

export function getUILanguage(): LanguageCode {
  return navigator.language;
}
