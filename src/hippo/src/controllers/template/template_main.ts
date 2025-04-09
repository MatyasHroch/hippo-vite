import { Context } from "../../../types";
import { processNodes } from "./template_main_process";
import {getGlobalIfNodes} from "../globals";

export async function renderTemplate(
  template: Element,
  context: Context,
  nodesToSLot: Array<Element> = null,
  attributesFromParent: Array<Attr> = null
) {
  // const clonedTemplate = template.cloneNode(true) as Element; // first we will clone it so we will not change the original template
  const clonedTemplate = template;
  const { textNodes, attributeNodes, childComponents } = await processNodes(
    clonedTemplate,
    context,
    nodesToSLot,
    attributesFromParent
  );

  return { clonedTemplate, childComponents };
}

export function cloneElement<T extends Element>(element: T): T {
  const clonedElement = element.cloneNode(true) as T;
  for (const ifNode of getGlobalIfNodes()){
    if (ifNode.elementToRemoveOnFalse == element) {

      ifNode.elementToRemoveOnFalse = clonedElement;
      console.log("Setting to " + clonedElement.tagName)
    }
  }

  return clonedElement;

}
