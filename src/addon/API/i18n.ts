// There isn't a good way to detect languages without downloading several
// megabytes of pacakges so we just assume everything is English
import callbackWrapper from "../callbackWrapper";

export const detectLanguage = callbackWrapper($detectLanguage);

async function $detectLanguage(content: string): Promise<{
  isReliable: boolean;
  languages: { language: string; percentage: number }[];
}> {
  return {
    isReliable: false,
    languages: [
      {
        language: "en",
        percentage: 100
      }
    ]
  };
}

export const getAcceptLanguages = callbackWrapper($getAcceptLanguages);

async function $getAcceptLanguages(): Promise<string[]> {
  return navigator.languages.map((x) => x.replace(/-.+$/, "")) ?? ["en"];
}

// TODO: Create way to interact with extension source files
export function getMessage() {}

export function getUILanguage(): string {
  return navigator.language;
}
