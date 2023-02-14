import { protocols, setProtocols } from "~/data/appState";

export default class Protocol {
  #match: RegExp;
  #domains: Map<string, string> = new Map<string, string>();
  #prefix: string;

  constructor(prefix: string) {
    this.#match = new RegExp(`^${prefix}:`);
    this.#prefix = prefix;

    setProtocols([...protocols(), this]);
  }

  register(domain: string, path: string) {
    this.#domains.set(domain, path);
  }

  find(query: string): string | undefined {
    return (
      this.#domains.get(query) ||
      (this.#domains.get("*")
        ? `${this.#domains.get("*")}?q=${query}`
        : undefined)
    );
  }

  reverse(path: string): string | undefined {
    for (const [domain, p] of this.#domains) {
      let match = false;
      try {
        if (new URL(path).pathname === p) match = true;
      } catch {}
      if (p === path || match) {
        if (domain === "*") {
          try {
            return `${this.#prefix}:${new URL(path).searchParams.get("q")}`;
          } catch {}
        }
        return `${this.#prefix}:${domain}`;
      }
    }
  }

  get match(): RegExp {
    return this.#match;
  }
}
