import { Context } from "../../../types";
import {
  bindAttribute,
  getVariableFromTemplateString,
  getVariableNameToAttributeBinding,
  getVariableNameToAttributeModeling,
  modelAttribute,
} from "./template_attributes";
import { UserDefinedComponent } from "../../../types/component";
import { bindTextNode } from "./template_text_nodes";
import { Keywords } from "../../../enums/keywords";
import { derenderIfNode, renderIfNode } from "./template_if_nodes";
import { processFor } from "./template_for";
import { getIfPlaceholderTag } from "../../helpers/template";

type ChildrenArray = Array<{
  tag: Element;
  component: UserDefinedComponent;
  nodesToSLot?: Array<Element>;
  slot?: Element;
  name?: string;
}>;

export async function processNodes(
  node: Element,
  context: Context,
  nodesToSlot: Array<Element> = null
) {
  const textNodes: Array<Element> = [];
  const attributeNodes = {
    toBind: [],
    toModel: [],
  };
  const childComponents: ChildrenArray = [];

  try {
    // Handle if nodes
    if (node.attributes && node.attributes.getNamedItem(Keywords.if)) {
      const ifAttribute = node.attributes.getNamedItem(Keywords.if);
      if (!ifAttribute) {
        throw new Error("If attribute not found");
      }

      const variableName = ifAttribute.value.trim();
      const variable = getVariableFromTemplateString(context, variableName);

      if (!variable) {
        throw new Error(`Variable "${variableName}" not found in context`);
      }

      const ifNode = {
        placeholderNode: getIfPlaceholderTag(),
        templateNode: node,
        context: context,
        nodesToSlot: nodesToSlot,
        renderedTemplateNode: node,
      };

      variable.ifNodes.push(ifNode);
      derenderIfNode(ifNode);

      if (variable.value) {
        await renderIfNode(ifNode);
      }

      return {
        textNodes,
        attributeNodes,
        childComponents,
      };
    }

    // Handle for nodes
    if (node.attributes && node.attributes.getNamedItem(Keywords.for)) {
      await processFor(context, node, nodesToSlot);
      return {
        textNodes,
        attributeNodes,
        childComponents,
      };
    }

    // Process component nodes
    const isComponent = !!context.childComponents[node.tagName];
    if (isComponent) {
      const component = context.childComponents[node.nodeName];
      if (!component) {
        throw new Error(`Component "${node.nodeName}" not found in context`);
      }

      childComponents.push({
        name: component.name,
        tag: node,
        component: component,
        nodesToSLot: Array.from(node.children),
      });
    }

    // Process attributes
    if (!isComponent && node.attributes && node.attributes.length > 0) {
      for (const attr of Array.from(node.attributes)) {
        const variableTemplateName = getVariableNameToAttributeBinding(attr);
        if (variableTemplateName) {
          attributeNodes.toBind.push(node);
          bindAttribute(context, attr, node, variableTemplateName);
        } else {
          const variableTemplateName = getVariableNameToAttributeModeling(attr);
          if (variableTemplateName) {
            attributeNodes.toModel.push(node);
            modelAttribute(context, attr, node, variableTemplateName);
          }
        }
      }
    }

    // Process child nodes
    if (node.childNodes.length > 0) {
      for (const childNode of Array.from(node.childNodes)) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const result = await processNodes(childNode as Element, context);
          textNodes.push(...result.textNodes);
          attributeNodes.toBind.push(...result.attributeNodes.toBind);
          attributeNodes.toModel.push(...result.attributeNodes.toModel);
          childComponents.push(...result.childComponents);
        }
      }
    } else if (
      !isComponent &&
      node.nodeType === Node.TEXT_NODE &&
      node.textContent !== ""
    ) {
      bindTextNode(context, node);
      textNodes.push(node);
    }

    return {
      textNodes,
      attributeNodes,
      childComponents,
    };
  } catch (error) {
    console.error("Error processing node:", error);
    throw error;
  }
}

export function stringToHtml(htmlString: string) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.firstElementChild;
}

export function findVariables(node: Node) {
  return node.textContent.match(/{{\s*[\w.]+\s*}}/g);
}

export function variableFromTextWithBraces(
  context: Context,
  text: string,
  createNewPartial = true
) {
  const slicedText = text.slice(2, -2).trim();
  return getVariableFromTemplateString(context, slicedText, createNewPartial);
}
