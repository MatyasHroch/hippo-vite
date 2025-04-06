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
import { bindEventToHandler, isEventToHandle } from "./template_events";

type ChildrenArray = Array<{
  tag: Element;
  component: UserDefinedComponent;
  nodesToSLot?: Array<Element>;
  slot?: Element;
  name?: string;
  attributesFromParent?: Array<Attr>;
}>;

export async function processNodes(
  node: Element,
  context: Context,
  nodesToSlot: Array<Element> = null,
  attributesFromParent: Array<Attr> = null
) {
  const textNodes: Array<Element> = [];
  // All elements with attributes starting with "bind:" or "model:"
  const attributeNodes = {
    toBind: [],
    toModel: [],
  };
  // all components that should be rendered after all the bindings
  const childComponents: ChildrenArray = [];

  // HERE WE CHECK IF THE CHILD COMPONENT HAS ATTRIBUTES FROM THE PARENT
  if (attributesFromParent) {
    for (const attr of attributesFromParent) {
      // TODO - if the attribute already exists, we check if the value can be merged
      // if the value can be merged, we merge it like with the class attribute
      // if the value cannot be merged, we replace it with the new value -> !parent has priority!
      debugger;
      const attributeName = attr.name;
      const attributeValue = attr.value;
      const existingAttribute = node.attributes.getNamedItem(attributeName);
      if (existingAttribute) {
        const existingAttributeValue = existingAttribute.value;
        if (attributeName === "class") {
          // TODO - merge the values
          const existingClasses = existingAttributeValue.split(" ");
          const newClasses = attributeValue.split(" ");
          const mergedClasses = [...existingClasses, ...newClasses];
          const uniqueClasses = [...new Set(mergedClasses)];
          existingAttribute.value = uniqueClasses.join(" ");
        } else {
          existingAttribute.value = attributeValue;
        }
      } else {
        node.setAttribute(attributeName, attributeValue);
      }
    }
  }

  // TODO - if and else solve here
  if (node.attributes && node.attributes.getNamedItem(Keywords.if)) {
    const ifAttribute = node.attributes.getNamedItem(Keywords.if);
    // TODO - nest this to some function please
    // TODO - here implement some syntactic sugar for the library users
    const variableName = ifAttribute.value.trim();
    const variable = getVariableFromTemplateString(context, variableName);
    if (!variable)
      Error("Variable with name " + variableName + " has not found");

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

    // TODO - node and context to a function, which will process the node and then removes the father node
    // TODO - if value True, just continue the rendering
    // TODO - if value False, remove the inner html and replace it with the
  }

  // TODO - h-for solve here
  if (node.attributes && node.attributes.getNamedItem(Keywords.for)) {
    await processFor(context, node, nodesToSlot);

    return {
      textNodes,
      attributeNodes,
      childComponents,
    };
  }

  // if the node is component, we skip the bindings, leave it to the high level function
  const isComponent = !!context.childComponents[node.tagName];
  if (isComponent) {
    const component = context.childComponents[node.nodeName];
    debugger;
    childComponents.push({
      name: component.name,
      tag: node,
      component: component,
      nodesToSLot: Array.from(node.children),
      attributesFromParent: Array.from(node.attributes),
    });
  }

  // ATTRIBUTES
  // find attributes to bind and model and bind them and model them
  if (!isComponent && node.attributes && node.attributes.length > 0) {
    for (const attr of Array.from(node.attributes)) {
      // EVENTS
      // debugger;
      if (isEventToHandle(context, attr)) {
        bindEventToHandler(context, attr, node);
      }

      // ONE WAY ATTRIBUTE BINDING
      const variableTemplateName = getVariableNameToAttributeBinding(attr);
      if (variableTemplateName) {
        attributeNodes.toBind.push(node);
        bindAttribute(context, attr, node, variableTemplateName);
      }

      // TWO WAY ATTRIBUTE BINDING
      else {
        const variableTemplateName = getVariableNameToAttributeModeling(attr);
        if (variableTemplateName) {
          attributeNodes.toModel.push(node);
          modelAttribute(context, attr, node, variableTemplateName);
        }
      }
    }
  }

  // CHILDREN processing
  // Here we recursively go to the next nodes
  if (node.childNodes.length > 0) {
    // when the node is not a leaf
    for (const childNode of Array.from(node.childNodes)) {
      // now we are going to the next levels so we will delete the temporary variables
      context.temporaryVariables = {};

      // recursively add all the textNodes and attributes to bind
      const result = await processNodes(
        childNode as Element,
        context,
        nodesToSlot,
        // we need the attributes from the parent just for the first level, so we need to pass null for the rest of the levels
        null
      );
      textNodes.push(...result.textNodes);
      attributeNodes.toBind.push(...attributeNodes.toBind);
      attributeNodes.toModel.push(...attributeNodes.toModel);
      childComponents.push(...result.childComponents);
    }
  } else if (
    !isComponent &&
    node.nodeType == Node.TEXT_NODE &&
    node.textContent !== ""
  ) {
    // when the node is a leaf so we can inspect the text nodes
    bindTextNode(context, node);
    textNodes.push(node);
  }

  return {
    textNodes,
    attributeNodes,
    childComponents,
  };
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
  return getVariableFromTemplateString(context, slicedText);
}
