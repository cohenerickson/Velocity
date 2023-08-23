import Protocol from "~/api/Protocol";

const about = new Protocol("about");

about.register("blank", "about:blank");
about.register("srcdoc", "about:srcdoc");
about.register("newTab", "/internal/newTab");
about.register("preferences", "/internal/preferences");
about.register("bookmarks", "/internal/bookmarks");
about.register("history", "/internal/history");

const viewSource = new Protocol("view-source");

viewSource.register("*", "/internal/view-source");
