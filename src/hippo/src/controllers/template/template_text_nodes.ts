import { Context } from "../../../types";
import {
  findVariables,
  variableFromTextWithBraces,
} from "./template_main_process";
import { Variable } from "../../../types/variable";
import { textNodePattern } from "./constants";
import { getPlaceholderTag, unwrapElement } from "../../helpers/template";
import { putBeforeElement } from "./template_for";

export function bindTextNode(context: Context, node: Element) {
  const foundVariables = findVariables(node);

  if (foundVariables) {
    const nodeText = node.nodeValue;
    const splitText = splitNodeText(nodeText);
    const parent = node.parentNode;
    const placeholder = getPlaceholderTag();
    putBeforeElement(node, placeholder);

    composeTextNodes(context, splitText, context.variables, placeholder);
    unwrapElement(placeholder);

    // we delete the original node
    parent.removeChild(node);
  }
}

function renderTextNode(
  context: Context,
  nodeText: string,
  variables: Record<string, Variable<any>>
) {
  if (nodeText.startsWith("{{") && nodeText.endsWith("}}")) {
    const variable = variableFromTextWithBraces(context, nodeText);

    if (!variable) {
      console.error(`Variable ${nodeText} not found.`);
      return document.createTextNode("");
    }

    // TODO - here handle how to behave when the value is something weird (null, undefined, Array of something,...)
    const value = variable.value;
    const element = document.createTextNode(value);
    variable.textNodes.push(element);

    return element;
  }

  return document.createTextNode(nodeText);
}

function composeTextNodes(
  context: Context,
  splitText: Array<string>,
  variables: Record<string, Variable<any>>,
  container: Element
) {
  for (const text of splitText) {
    const textNode = renderTextNode(context, text, variables);
    container.appendChild(textNode);
  }
  return container;
}

function splitNodeText(nodeText: string) {
  // Split the text using the pattern
  const textParts = nodeText.split(textNodePattern);
  return textParts.filter((textPart) => textPart !== "");
}
