import { processTemplate } from "../component/component_main";
import { IfNodeStructure } from "../../../types/variable";
import { Keywords } from "../../../enums/keywords";
import { cloneElement } from "./template_main";
import {getVariableByName} from "./template_attributes";
import {getPlaceholderTag} from "../../helpers/template";
import {Context} from "../../../types";

export function derenderIfNode(ifNode: IfNodeStructure) {
  const node = ifNode.renderedTemplateNode;
  const placeholder = ifNode.placeholderNode;

  if (node.hasAttribute(Keywords.if)) {
    node.removeAttribute(Keywords.if);
  }

  if (node.parentNode) {
    node.parentNode.insertBefore(placeholder, node.nextSibling);
    node.parentNode.removeChild(node);
  }
}

export async function renderIfNode(ifNode: IfNodeStructure) {
  const template = cloneElement(ifNode.templateNode);
  const placeholder = ifNode.placeholderNode;
  const context = ifNode.context;
  const nodesToSlot = ifNode.nodesToSlot;

  // render it and then mount to the placeholder
  const result = await processTemplate(
    {
      context,
      name: "if-node",
      template: template,
    },
    placeholder,
    nodesToSlot
  );
  const newTemplate = result.template;
  const parent = placeholder.parentNode;
  if (parent) {
    parent.insertBefore(newTemplate, placeholder);
    parent.removeChild(placeholder);
  }

  ifNode.renderedTemplateNode = newTemplate;
}

export async function createIfNode(context: Context, ifAttribute: Attr, node: Element, nodesToSlot: Array<Element>, isComponent: boolean = false) {
  const variableName = ifAttribute.value.trim();
  const variable = getVariableByName(context, variableName);

  if (!variable){
    console.error("Variable with name " + variableName + " has not found")
    return
  }

  const ifNode = {
    placeholderNode: getPlaceholderTag(),
    templateNode: node,
    context: context,
    nodesToSlot: nodesToSlot,
    renderedTemplateNode: node,
    elementToRemoveOnFalse: node,
    isComponent: isComponent
  };

  variable.ifNodes.push(ifNode);
  derenderIfNode(ifNode);

  if (variable.value) {
    await renderIfNode(ifNode);
  }
}
