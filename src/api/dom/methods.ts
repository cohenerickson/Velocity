export function openOrClosedShadowRoot(elm: HTMLElement): ShadowRoot | null {
  // In order to get closed shadow roots, we will need to make a proxied HTMLElement
  return elm.shadowRoot;
}
