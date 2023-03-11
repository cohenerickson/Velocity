# API

The Velocity API is exposed through the `Velocity` global object.

# Functions

- `getTabs` - Returns an array of all open tabs
- `getBookmarks` - Returns an array of all bookmarks
- `getProtocol` - Returns an array of all protocols

# Classes

## `Tab` - Open new tabs

### Paramaters

- _`URL` - A string representing the URL to open_
- _`setActive` - A boolean value to focus the newly opened tab_

### Methods

- _`goBack` - Navigate backwards in history_
- _`goForward` - Navigate forwards in history_
- _`reload` - Reload the tab_
- _`stop` - Stop the tab from loading any further_
- _`navigate` - Navigate to a new URL_
  - _`URL` - A string representing where to navigate to_
- _`close` - Close the tab_
- _`bookmark` - Bookmark the tab as it is_
- _`executeScript` - Evaluate JavaScript inside the tab scope_
- _`setDevTools` - Open/close Eruda dev tools_
  - _`isOpen` - A boolean value representing the dev tool open status_

### Values

TODO

### Example

```js
new Tab("about:newTab", true); // Open a new tab
```

## `Bookmark` - Create new bookmarks

### Paramaters

- _`options`_
  - _`name` - Display name for bookmark_
  - _`url` - Bookmark URL_
  - _`icon` - URL to bookmark icon_
  - _`id?` - Optional ID feild_

### Methods

- _`delete` - Delete the bookmark_

### Example

```js
new Bookmark({
  name: "Radon Games",
  url: "https://radon.games/",
  icon: "https://radon.games/favicon.ico"
});
```

## `Protocol` - Create custom protocols

### Paramaters

- _`prefix` - Prefix to use for the protocol_

### Methods

- _`register` - Register a new domain_
  - _`domain` - A string representing the domain ("\*" for wildcard)_
  - _`URL` - A string URL to map the domain to_

### Example

```js
const proto = new Protocol("rd");

proto.register("*", "https://radon.games/");
```

## `ContextItem` - Modify context menus

### Paramaters

- _`options`_
  - _`separator?` - Boolean value to consider item a separator_
  - _`text?` - Text value of the context button_
  - _`onClick?` - A function that is executed when a user clicks the button_

### Example

```js
element.addEventListener("contextmenu", (event) => {
  event.data = event.data ?? [];

  event.data.push(
    new ContextItem({
      text: "Click me!",
      onClick: () => {
        alert("You clicked me!");
      }
    })
  );
});
```

## `Keybind` - Create new keybinds

### Paramaters

- _`options`_
  - _`name` - Name of keybind_
  - _`description` - Description of keybind_
  - _`key` - Non case sensitive key_
  - _`ctrl?` - Boolean to require ctrl_
  - _`shift?` - Boolean to require shift_
  - _`alt?` - Boolean to require alt_
  - _`meta?` - Boolean to require meta_
  - _`callback` - Callback when keybind is run_
    - _`event` - Keyboard event_

### Methods

- _`toString` - Return the keybind as a readable string_

### Example

```js
new Keybind({
  name: "Find",
  description: "Find text in page",
  key: "f",
  ctrl: true,
  callback(event) {
    // do something
    alert("You ran the keybind!");
  }
});
```

# Objects

## `history` - Modify history entries

### Methods

- _`add` - Async function to add or modify history entries_
- _`get` - Async function to get all entries_
  - _`tab?` - the `Tab` object to add or modify in history_
- _`delete` - Async function to delete an entry_
  - _`id` - the history object id `<Tab>.historyId`_
- _`clear` - Async function clear all entries_

### Example

```js
await history.clear();
```
