import AddonReader from "~/api/AddonReader";
import RuntimeModifier from "~/api/RuntimeModifier";
import { addons } from "~/data/appState";
import { install, uninstall } from "~/manager/addonStateManager";

const addonStoreModifier = new RuntimeModifier("addonstore");

class AddonEvent extends Event {
  id: string;

  constructor(type: string, id: string) {
    super(type);
    this.id = id;
  }
}

class AddonManager extends EventTarget {
  abuseReportPanelEnabled = false as const;

  constructor() {
    super();
  }

  async createInstall(data: { url: string; hash: string }) {
    const manager: AddonManager = this;
    const event = new (class extends EventTarget {
      async install() {
        const reader = new AddonReader(data.url);
        this.dispatchEvent(new Event("onDownloadStarted"));
        reader.ready
          .then(async () => {
            this.dispatchEvent(new Event("onDownloadEnded"));
            this.dispatchEvent(new Event("onInstallStarted"));
            install(reader, data.url)
              .then((id: string) => {
                this.dispatchEvent(new Event("onInstallEnded"));
                manager.dispatchEvent(new AddonEvent("onInstalled", id));
              })
              .catch(() => {
                this.dispatchEvent(new Event("onInstallCancelled"));
              });
          })
          .catch(() => {
            this.dispatchEvent(new Event("onDownloadFailed"));
          });
      }
    })();
    return event;
  }

  async getAddonByID(id: string) {
    const addon = addons().find((x) => x.id === id);
    return addon
      ? Object.assign(
          {
            uninstall: () => {
              this.dispatchEvent(new AddonEvent("onUninstalling", id));
              uninstall(addon)
                .then(() => {
                  this.dispatchEvent(new AddonEvent("onUninstalled", id));
                })
                .catch(() => {});
            },
            setEnabled: (state: boolean) => {
              // TODO: implement state toggles
              if (state) {
                this.dispatchEvent(new AddonEvent("onEnabling", id));
                setTimeout(() => {
                  this.dispatchEvent(new AddonEvent("onEnabled", id));
                }, 1000);
              } else {
                this.dispatchEvent(new AddonEvent("onDisabling", id));
                setTimeout(() => {
                  this.dispatchEvent(new AddonEvent("onDisabled", id));
                }, 1000);
              }
            }
          },
          addon
        )
      : undefined;
  }

  reportAbuse() {}
}

addonStoreModifier.createInject("*://addons.mozilla.org/*", ({ navigator }) => {
  const addonManager = new AddonManager();

  Object.defineProperty(navigator, "mozAddonManager", {
    get() {
      return addonManager;
    }
  });
});
