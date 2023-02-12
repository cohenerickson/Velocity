import Protocol from "~/data/Protocol";

export const protocols: Protocol[] = [];

const about = new Protocol("about");

about.register("blank", "about:blank");
about.register("newTab", "/internal/newTab");
about.register("preferences", "/internal/preferences");

const viewSource = new Protocol("view-source");

viewSource.register("*", "/internal/view-source");

export default {
  find: (url: string) => {
    for (const protocol of protocols) {
      if (protocol.match.test(url)) {
        const domain = url.replace(protocol.match, "");
        return protocol.find(domain);
      }
    }
  },
  reverse: (url: string) => {
    for (const protocol of protocols) {
      if (protocol.reverse(url)) {
        return protocol.reverse(url);
      }
    }
  }
};
