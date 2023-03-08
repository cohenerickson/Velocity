import { protocols } from "~/data/appState";

export default {
  find: (url: string) => {
    for (const protocol of protocols()) {
      if (protocol.match.test(url)) {
        const domain = url.replace(protocol.match, "");
        return protocol.find(domain);
      }
    }
  },
  reverse: (url: string) => {
    for (const protocol of protocols()) {
      if (protocol.reverse(url)) {
        return protocol.reverse(url);
      }
    }
  }
};
