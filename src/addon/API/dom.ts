function openOrClosedShadowRoot(elm: HTMLElement): ShadowRoot | null {
  // LIMITATION: Only possible to get open shadow roots
  return elm.shadowRoot;
}

export default { openOrClosedShadowRoot };
