<h1 align="center">
  Velocity
</h1>

<p align="center">
  A highly customizable tabbed proxy for evading internet censorship.
</p>

## About

The initial inspiration for Velocity came from other proxies such as Hypertabs and Rammerhead Browser. After using these proxies issues arose that broke the illusion of using a web browser which velocity attempts to fix. 

## Features

 * Sleek Firefox inspired UI
 * Proper link handling
 * Script injection for native functions
 
## Internal URL's
 * `about:newTab` - New tab page
 * `about:preferences` - Preferences page
 * `about:blank` - Blank document

## Commands

Velocity implements many commands that web browsers commonly use in order to do certain functions. Due to the limitations of JavaScript many of these have to be adapted but listed below is all commands that have been implemented so far.

 * `Ctrl + R` - Reload current tab
 * `Ctrl + D` - Bookmark current page (limited support)
 * `Ctrl + E` - Search
 * `Alt + ArrowLeft` - Navigate backwards in history
 * `Alt + ArrowRight` - Navigate forward in history

### Adapted commands
 * `Alt + T` - Open new tab (originally `Ctrl + T`)
 * `Alt + W` - Close current tab (originally `Ctrl + W`)

## Roadmap

Velocity is still in it's early stages but if it gains enough interest among the community there are quite a few other features that I would like to implement, listed below are a few of these.

 * Custom context menus
 * View source protocol (`view-source:`)
 * Unblocked dev tools
 * And more...
