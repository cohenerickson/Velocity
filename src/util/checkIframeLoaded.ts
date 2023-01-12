export default function checkIframeLoaded(
  iframe: HTMLIFrameElement,
  callback: () => void
): void {
  const document = iframe.contentDocument;

  if (document?.readyState === "complete") {
    callback();
    return;
  }

  window.setTimeout(checkIframeLoaded, 100);
}
