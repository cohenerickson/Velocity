function openOrClosedShadowRoot(elm: HTMLElement): ShadowRoot | null {
  // LIMITATION: Only possible to get open shadow roots (without a proxied element api)
  return elm.shadowRoot;
}

export default { openOrClosedShadowRoot };
