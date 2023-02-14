## `Velocity.Tab`

Creates a new tab.

### Paramaters

- _{url: string}_ - URL to open in the new tab.
- _{setActive?: boolean}_ - When the tab opens, switch to it immediately.

### Example

```js
new Velocity.Tab("https://www.google.com/", true);
```

## `Velocity.Protocol`

Create a new protocol.

### Paramaters

- _{prefix: string}_ - Prefix to use for the protocol.

### Protocol.register() - Register a new domain on the protocol.

- _{domain: string | "\*"}_ - Domain for the registration _("\*" for wildcard)_
- _{path: string}_ - URL to map the domain to _(not proxied)_

### Example

```js
const protocol = new Velocity.Protocol("rd");

protocol.register("*", "https://radon.games/");
```

## `Velocity.ContextItem`

Creates a new context menu item.

### Paramaters

- _{text?: string}_ - Text for item display.
- _{onClick?: () => void}_ - Function executed when user clicks the button.
- _{separator?: boolean}_ - Create a separator line instead of button.

### Example

```js
element.addEventListener("contextmenu", (event) => {
  event.data = event.data ?? [];

  event.data.push(
    new Velocity.ContextItem({
      text: "Click me!",
      onClick: () => {
        alert("You clicked me!");
      }
    })
  );
});
```
