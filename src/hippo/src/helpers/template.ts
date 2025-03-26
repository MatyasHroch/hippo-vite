export function getIfPlaceholderTag(text = null) {
  const placeHolder = document.createElement("div");
  placeHolder.style.color = "blue";
  if (text) {
    placeHolder.textContent = text;
  }
  return placeHolder;
}

export function unwrapElement(element: Element) {
  if (!element || !element.parentNode) return;

  const parent = element.parentNode;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}
