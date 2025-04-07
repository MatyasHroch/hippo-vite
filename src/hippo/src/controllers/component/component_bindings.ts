import { Context } from "src/hippo/types";
import { getVariableByName } from "../template/template_attributes";
import { createComputedVariable } from "../variable/variable_computed";

export function bindVariable(
  childContext: Context,
  parentVariableName: string,
  childVariableName: string
) {
  const variable = getVariableByName(childContext.parent, parentVariableName);
  if (!variable) return null;
  // TODO - speed up, if it is already read only, we can simply pass this to the child

  // when we pass the childContext and not the parent's, we create the computed variable right away
  const boundVariable = createComputedVariable(
    childContext,
    () => variable.value,
    childVariableName,
    [variable]
  );

  childContext.properties[childVariableName] = boundVariable;
  return childContext.properties;
}

export function modelVariable(
  childContext: Context,
  parentVariableName: string,
  childVariableName: string
) {
  const variable = getVariableByName(childContext.parent, parentVariableName);
  if (!variable) return null;

  // when we want to make it two way, we simply pass the variable itself
  childContext.properties[childVariableName] = variable;
  return childContext.properties;
}
