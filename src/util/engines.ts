const engines = {
  google: {
    name: "Google",
    searchStr: "https://www.google.com/search?q=%s"
  },
  bing: {
    name: "Bing",
    searchStr: "https://www.bing.com/search?q=%s"
  },
  duckduckgo: {
    name: "DuckDuckGo",
    searchStr: "https://duckduckgo.com/?q=%s"
  },
  brave: {
    name: "Brave",
    searchStr: "https://search.brave.com/search?q=%s"
  },
  yahoo: {
    name: "Yahoo",
    searchStr: "https://search.yahoo.com/search?p=%s"
  }
};

export default engines;
