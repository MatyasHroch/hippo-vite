import { Context } from "../../../types";
import { Keywords } from "../../../enums/keywords";
import { attributeBindPattern, attributeModelPattern } from "./constants";
import { renderAttribute } from "../variable/variable_set";
import { createPartialFromTemplateString } from "../variable/variable_partials";
import string from "vite-plugin-string";
import { Variable } from "../../../types/variable";

// 1) registers the attribute to the variable
// 2) calls renderAttribute
export function bindAttribute(
  context: Context,
  attribute: Attr,
  node: Element,
  variableTemplateString: string
) {
  const variable = getVariableFromTemplateString(
    context,
    variableTemplateString
  );

  const attributeNode = { node, attribute };
  variable.attributes.push(attributeNode);

  // TODO - handle bolean attributes somehow - DONE, but not added to the attributeNodes as attr and the node
  renderAttribute(attributeNode, variable.value);
  return variable;
}

// 1) calls the bindAttribute function
// 2) adds "input" event listener to change variable value from the user input
export function modelAttribute(
  context: Context,
  attribute: Attr,
  node: Element,
  variableTemplateString: string
) {
  const variable = bindAttribute(
    context,
    attribute,
    node,
    variableTemplateString
  );
  if (!variable) return;
  node.addEventListener("input", (event: Event) => {
    const value = event.target[attribute.name];
    variable.set(value);
  });
  return variable;
}

// gets the variable template string
export function getVariableNameToAttributeBinding(attribute: Attr) {
  return getVariableNameToAttribute(attribute, attributeBindPattern);
}

// gets the variable template string
export function getVariableNameToAttributeModeling(attribute: Attr) {
  return getVariableNameToAttribute(attribute, attributeModelPattern);
}

// gets the variable template string
export function getVariableNameToAttribute(
  attribute: Attr,
  attributePattern: RegExp
) {
  const match = attribute.value.trim().match(attributePattern);
  return match ? match[1] : null;
}

export function getVariableFromTemplateString(
  context: Context,
  variableString: string,
  createNewPartial = true,
  readOnly = false
): Variable<any> | null {
  if (!variableString) {
    throw new Error("Variable string cannot be empty");
  }

  if (!context) {
    throw new Error("Context cannot be null or undefined");
  }

  // Direct variable lookup
  if (context.variables[variableString]) {
    return context.variables[variableString];
  }

  // Handle nested paths
  if (variableString.includes(".")) {
    const pathParts = variableString.split(".");
    let currentValue = context.variables[pathParts[0]];

    if (!currentValue) {
      console.warn(`Variable "${pathParts[0]}" not found in context`);
      return null;
    }

    // Validate path exists
    for (let i = 1; i < pathParts.length; i++) {
      if (currentValue.value === null || currentValue.value === undefined) {
        console.warn(
          `Path "${pathParts.slice(0, i + 1).join(".")}" is invalid`
        );
        return null;
      }
      currentValue = currentValue.value[pathParts[i]];
    }

    if (createNewPartial && currentValue !== undefined) {
      return createPartialFromTemplateString(context, variableString);
    }
  }

  return null;
}
