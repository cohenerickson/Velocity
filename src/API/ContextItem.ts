type ContextItemOptions =
  | {
      text: string;
      onClick: () => void;
    }
  | {
      separator: true;
    };

export default class ContextItem {
  #text?: string;
  #onClick?: () => void;
  #separator?: boolean;

  constructor(options: ContextItemOptions) {
    if ("separator" in options) {
      this.#separator = options.separator;
      return;
    }
    this.#text = options.text;
    this.#onClick = options.onClick;
  }

  get text(): string | undefined {
    return this.#text;
  }

  get onClick(): (() => void) | undefined {
    return this.#onClick;
  }

  get separator(): boolean | undefined {
    return this.#separator;
  }
}
