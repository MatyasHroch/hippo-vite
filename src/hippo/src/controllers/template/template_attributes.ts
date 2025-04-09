import { Context } from "../../../types";
import { attributeBindPattern, attributeModelPattern } from "./constants";
import { renderAttribute } from "../variable/variable_set";
import { createPartialFromTemplateString } from "../variable/variable_partials";
import { Variable } from "../../../types/variable";

// 1) registers the attribute to the variable
// 2) calls renderAttribute
export function bindAttribute(
  context: Context,
  attribute: Attr,
  node: Element,
  variableTemplateString: string
) {
  const variable = getVariableByName(context, variableTemplateString);
  if (!variable) return null;

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

export function getVariableByName(
  context: Context,
  variableString: string,
  createNewPartial = true,
  readOnly = false
): Variable<any> | null {
  // TODO - WE SHOULD MAKE IT CASE INSENSITIVE

  if (context.variables[variableString]) {
    return context.variables[variableString];
  }

  if (context.properties[variableString]) {
    return context.properties[variableString];
  }

  if (context.temporaryVariables[variableString]) {
    return context.temporaryVariables[variableString];
  }
  // TODO - here add if the variable is not in the properties and computed and so on

  if (variableString && createNewPartial && variableString.includes(".")) {
    return createPartialFromTemplateString(context, variableString);
  }

  return null;
}
