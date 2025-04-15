import {getGlobalIfNodes} from "../controllers/globals";
import {IfNodeStructure} from "../../types/variable";

export function getPlaceholderTag(text = null) {
  const placeHolder = document.createElement("div");
  placeHolder.style.color = "blue";
  if (text) {
    placeHolder.textContent = text;
  }
  return placeHolder;
}

export function unwrapElement(element: Element) {
  if (!element || !element.parentNode) return;

  let foundIfNode : IfNodeStructure;

  for (const ifNode of getGlobalIfNodes()){
    if(ifNode.elementToRemoveOnFalse == element || ifNode.placeholderNode){
      foundIfNode = ifNode
    }
  }

  if (foundIfNode) {
    foundIfNode.elementToRemoveOnFalse = element.firstElementChild;
    console.log("Setting to :");
    console.log(element.firstElementChild)
  }

  const parent = element.parentNode;
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}
