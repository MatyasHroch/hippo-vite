import { Context } from "src/hippo/types";
import { getVariableByName } from "./template_attributes";

export function bindEventToHandler(
  context: Context,
  attribute: Attr,
  element: Element
) {
  const attributeName = attribute.name;
  const handler = context.handlers[attributeName].handler;
  // Convert 'onclick' to 'click' for addEventListener by removing first two chars
  const eventName = attributeName.slice(2);
  console.log("Adding event listener for:", eventName);

  // Extract arguments from function call pattern
  const value = attribute.value;
  const argumentsValues = [];

  let eventObjectIndex = -1;
  // we test if there are special arguments
  if (value && value.includes("(") && value.includes(")")) {
    const argsMatch = value.match(/\((.*)\)/);
    if (argsMatch) {
      const args = argsMatch[1].split(",").map((arg) => arg.trim());
      for (const arg of args) {
        if (arg === "event") {
          eventObjectIndex = args.indexOf(arg);
          continue;
        }
        const variable = getVariableByName(context, arg);
        if (variable) {
          argumentsValues.push(variable.value);
        }
      }
    }
    element.addEventListener(eventName, function (event) {
      if (eventObjectIndex > -1) {
        argumentsValues.splice(eventObjectIndex, 0, event);
      }
      handler(...argumentsValues);
    });
  } else {
    // if there are no special arguments we just register normal event listener
    element.addEventListener(eventName, handler as (event: Event) => void);
  }

  // finally we remove the attribute
  element.removeAttribute(attributeName);
}

export function isEventToHandle(context: Context, attribute: Attr) {
  // TODO - change for the USER, so it will be about the value and not about the name of the attribute, or about the name and not about the attribute
  const attributeName = attribute.name;
  return attributeName in context.handlers;
}
