import { processTemplate } from "../component/component_main";
import { IfNodeStructure } from "../../../types/variable";
import { Keywords } from "../../../enums/keywords";
import { cloneElement } from "./template_main";

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
