import { ContentScripts, Permissions } from "webextension-manifest";
import Tab from "~/api/Tab";
import { patternToRegExp } from "~/util/";

export type ContentScript = ContentScripts[0] & {
  js?: Promise<string>;
  css?: Promise<string>;
};

const _: [ContentScript, Permissions][] = [];

export function subscribe(tab: Tab): void {
  tab.on("document_start", (url: string) => inject(tab, url));
  tab.on("document_end", (url: string) => inject(tab, url));
  tab.on("document_idle", (url: string) => inject(tab, url));
}

export function register(
  contentScript: ContentScript,
  permissions: Permissions
) {
  _.push([contentScript, permissions]);
}

function inject(tab: Tab, url: string) {
  _.forEach(([contentScript, permissions]) => {
    // Bypass other checks if addon is requesting to inject to about:blank
    if (!(contentScript.match_about_blank && /^about:blank/.test(url))) {
      // Check Match
      if (!matchAny(contentScript.matches.map(patternToRegExp), url)) return;
      // Check Exclude Match
      if (
        contentScript.exclude_matches &&
        matchAny(contentScript.exclude_matches.map(patternToRegExp), url)
      )
        return;
      // Check Glob
      if (
        contentScript.include_globs &&
        !matchAny(contentScript.include_globs.map(patternToRegExp), url)
      )
        return;
      // Check Exclude Glob
      if (
        contentScript.exclude_globs &&
        matchAny(contentScript.exclude_globs.map(patternToRegExp), url)
      )
        return;
      // Check permissions
      if (!matchAny(permissions.map(patternToRegExp), url)) return;
    }

    // Inject scripts
    if (contentScript.js) {
      contentScript.js.forEach(async (script) => {
        tab.executeScript(await script);
      });
    }
    if (contentScript.css) {
      contentScript.css.forEach(async (style) => {
        tab.addStyle(await style);
      });
    }
  });
}

function matchAny(regexs: RegExp[], url: string) {
  for (const regex of regexs) {
    if (regex.test(url)) return true;
  }
  return false;
}
