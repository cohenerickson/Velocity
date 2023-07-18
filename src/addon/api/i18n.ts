import callbackWrapper from "../util/callbackWrapper";
import { loadModule, CldFactory } from "cld3-asm";

let cldFactory: CldFactory;

export const detectLanguage = callbackWrapper($detectLanguage);

async function $detectLanguage(content: string): Promise<{
  isReliable: boolean;
  languages: { language: string; percentage: number }[];
}> {
  if (!cldFactory) {
    cldFactory = await loadModule();
  }

  const identifier = cldFactory.create(0, content.length);

  const result = identifier.findMostFrequentLanguages(content, 100);

  return {
    isReliable: result[0].is_reliable,
    languages: result.map((x: any) => ({
      language: x.language,
      percentage: x.proportion * 100
    }))
  };
}

export const getAcceptLanguages = callbackWrapper($getAcceptLanguages);

async function $getAcceptLanguages(): Promise<string[]> {
  return navigator.languages.map((x) => x.replace(/-.+$/, ""));
}

// TODO: Create way to interact with extension source files
export function getMessage() {}

export function getUILanguage(): string {
  return navigator.language;
}
