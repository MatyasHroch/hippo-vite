import { Context } from "src/hippo/types";
import { getVariableByName } from "./template_attributes";
import {Keywords} from "../../../enums/keywords";

export function bindEventToHandler(
    context: Context,
    attribute: Attr,
    element: Element,
    handlerStructure: HandlerStructure,
    isComponent: boolean = false,
) {
  let eventName = attribute.name;
  const handler = handlerStructure.handler;
  // Convert 'onclick' to 'click' for addEventListener by removing first two chars

  const isDomEvent = isDOMEvent(eventName);
  if (isDomEvent) {
    eventName = eventName.slice(2);
  }

  // Extract arguments from function call pattern
  const handlerDefinition = attribute.value;
  const argumentsValues = [];

  let eventObjectIndex = -1;
  // we test if there are special arguments
  if (handlerDefinition && handlerDefinition.includes("(") && handlerDefinition.includes(")")) {

    const argsMatch = handlerDefinition.match(/\((.*)\)/);
    if (argsMatch) {
      const args = argsMatch[1].split(",").map((arg) => arg.trim());
      for (const arg of args) {
        if (isDomEvent && arg === Keywords.nativeEvent) {
          eventObjectIndex = args.indexOf(arg);
          continue;
        }
        const variable = getVariableByName(context, arg);
        if (variable) {
          argumentsValues.push(variable.value);
        }
      }
    }
  }

  if (isDomEvent) {
    element.addEventListener(eventName, function (event) {
      if (eventObjectIndex > -1) {
        argumentsValues.splice(eventObjectIndex, 0, event);
      }
      handler(...argumentsValues);
    })
  }
  // HERE WE NEED TO REMOVE THE ELEMENT AS WELL
  else {
    context.eventHandlers[eventName] = {
      handlerName: handlerStructure.handlerName,
      stopEvent: handlerStructure.stopEvent,
      handler: () => {
        handler(...argumentsValues);
      }
    };
  }

  // HERE WE REMOVE THE ONCLICK ATTRIBUTE WHEN IT IS NOT A CHILD COMPONENT
  if (!isComponent) {
    element.removeAttribute(attribute.name);
  }

  // if it is not a component, we have already removed the attribute
  // if it is a native event, we let it be, and it will be then automatically passed to the child component
  // otherwise we need to mark the custom event for the child:
  if (isComponent && !isDomEvent) {
    // finally we mark the attribute for the child component
    element.setAttribute(attribute.name, Keywords.eventPrefix + context.id)
  }

}

export function findHandler(context: Context, attribute: Attr) {
  const potentialHandlerName = attribute.value.split("(")[0];
  for (const handlerName in context.handlers) {
    if (handlerName === potentialHandlerName) {
      return context.handlers[handlerName];
    }
  }
  return null
}

export function isDOMEvent(eventName: string): boolean {
  return eventName in document.createElement('div');
}