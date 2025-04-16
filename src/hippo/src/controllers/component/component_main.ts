import { createContext } from "../context";
import { Context } from "../../../types";
import { renderTemplate } from "../template/template_main";
import { Keywords } from "../../../enums/keywords";
import { NewComponentStruct } from "../../../types/component";
import { unwrapElement } from "../../helpers/template";
import { putBeforeElement } from "../template/template_for";
import {getVariableNameToAttributeBinding, getVariableNameToAttributeModeling} from "../template/template_attributes";
import { bindVariable, modelVariable } from "../component/component_bindings";


// TODO - should be renamed as process context
export async function processComponent(
  component: Function,
  parentContext: Context = null,
  elementToMount: Element = null,
  nodesToSlot: Array<Element> = null,
  attributesFromParent: Array<Attr> = null
) {
  const context = createContext(parentContext);
  const newComponent: NewComponentStruct = {
    context: context,
    name: component.name,
  };

  if (attributesFromParent){
    // WE NEED TO HAVE THE PROPERTIES OF THE PARENT REACHABLE - WEE NEED TO REMOVE THEM,
    // WE REMOVE THEM IN THE FIRST LEVEL OR RENDERING NOW
    context.temporaryVariables = {
      ...context.parent.properties,
      ...context.parent.variables,
    };

    // WE NEED TO PROCESS THE ATTRIBUTES FROM PARENT HERE
    for (const attr of attributesFromParent){
      // // TODO -  WE SHOULD MAKE IT CASE INSENSITIVE
      const variableNameToBind = getVariableNameToAttributeBinding(attr);
      if (variableNameToBind) {
        bindVariable(context, variableNameToBind, attr.name);
        continue;
      }

      const variableNameToModel = getVariableNameToAttributeModeling(attr);
      if (variableNameToModel) {
        modelVariable(context, variableNameToModel, attr.name);
      }
    }
  }

  // USER FUNCTION COMPONENT, !!! warning, can be async
  // TODO - what could the component function return?
  await component(context);

  // PROCESS THE TEMPLATE
  // Check if there is any
  if (!context.template) {
    console.warn("This component has no Template:" + component.name);
    return newComponent;
  }

  newComponent.template = context.template;

  return processTemplate(
    newComponent,
    elementToMount,
    nodesToSlot,
    attributesFromParent
  );
}

export async function processTemplate(
  newComponent: NewComponentStruct,
  elementToMount: Element = null,
  nodesToSlot: Array<Element> = null,
  attributesFromParent: Array<Attr> = null,
  mountFunction = defaultMount,
  mount: boolean = true
) {
  const context = newComponent.context;

  // Check if there is any
  if (!newComponent.template) {
    console.warn("This component has no Template:" + newComponent.name);
    return newComponent;
  }

  // Render the template
  const renderTemplateResult = await renderTemplate(
    newComponent.template,
    context,
    nodesToSlot,
    attributesFromParent
  );

  // TODO - here we just give up on not having just one root element in template
  const renderedTemplate = renderTemplateResult.clonedTemplate;

  if (!renderedTemplate) {
    console.warn(
      "Template was not rendered properly in the component" + newComponent.name
    );
    return newComponent;
  }

  // only if we render the template of the context, not just of the component, we change the context template
  if (newComponent.template === context.template) {
    context.template = renderedTemplate;
  }

  newComponent.template = renderedTemplate;

  if (!elementToMount) {
    console.warn("No element to mount this component:" + newComponent.name);
    return newComponent;
  }

  const childComponents = renderTemplateResult.childComponents;

  // MOUNT THE TEMPLATE
  // TODO 1) add my nodesToSlot to the template !!! Attention - the append method is moving the node- DONE
  // TODO speed it up, return it in the render template, dont look it up by the query selector
  const slot = renderedTemplate.querySelector(Keywords.slot);
  if (slot && nodesToSlot) {
    for (const node of nodesToSlot) {
      if (node.nodeName !== Keywords.slot.toUpperCase()) {
        putBeforeElement(slot, node);
      }
    }

    slot.remove();
  }

  // TODO  2) remove all my html, that will be placed to the child process so this is DONE
  //  because of the append method behavior

  if (mount) {
    mountFunction(elementToMount, newComponent.template);
  }

  // PROCESS ALL THE CHILDREN
  // now process the child components, after the attributes and the one way and two-way bindings

  for (const child of childComponents) {
    // console.log("childComponent " + child.name);
    // console.log("it has this slots: " + child.nodesToSLot);

    await processComponent(
      child.component,
      context,
      child.tag,
      child.nodesToSLot,
      child.attributesFromParent
    );
  }

  return newComponent;
}

function defaultMount(element: Element, templateToMount: Element) {
  element.appendChild(templateToMount);
  // TODO - if there is some problem with the ATTRIBUTES or else
  unwrapElement(element);
}
