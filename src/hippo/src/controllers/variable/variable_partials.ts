import { Variable } from "../../../types/variable";
import string from "vite-plugin-string";
import { Context } from "../../../types";
import { getGlobalContext } from "../globals";
import { createOriginVariable } from "./variable_main";

// creates a partial variable of any variable
// it should work for object paths like "user.value.address.city" as for "user.address.city"
export function createPartialVariable<T>(
  originVariable: Variable<any>,
  objectPath: string,
  context?: Context,
  name?: string
) {
  context ??= getGlobalContext();
  name ??= objectPath;

  // TODO - make sure it works even with the value and also without it
  const path = objectPath.split("value.")[1];
  const keys = path.split(".");

  let currentValue = originVariable.value;
  if (!currentValue) return;

  for (const key of keys) {
    // if I get to some point where the key does not exist, the objectPath is invalid
    if (currentValue[key] === undefined) new Error(`Invalid path: ${path}`);
    currentValue = currentValue[key];
  }

  // TODO - find out if there is already the same partial, if it does, just return it instead of creating a new one
  let partialVariable = originVariable.partialVariables[path];
  if (!partialVariable) {
    partialVariable = createOriginVariable<T>(name, currentValue);
    // setting up the slots ??
    partialVariable.pathFromOrigin = path;
    partialVariable.originVariable = originVariable;
    originVariable.partialVariables[path] = partialVariable;

    // TODO - optimaze this, so the origin variable will know it should not look for other updates then in the path
    //  and be careful about infinite loop
    // originVariable.set = (value: T) => {
    //     const keys = path.split(".");
    //     const lastKey = keys.pop()
    //     let currentValue = originVariable.value;
    //     for (const key of keys) {
    //         if (key in currentValue) {
    //             return new Error(`Invalid path: ${path}`);
    //         }
    //         currentValue = currentValue[key];
    //     }
    //     currentValue[lastKey] = value;
    //     originVariable.set(originVariable.value)
    // }
  }

  context.variables[partialVariable.name] = partialVariable;
  return partialVariable;
}

export function createPartialFromTemplateString(
  context: Context,
  fullObjectString: string,
  readOnly = false
) {
  const splitObjectString = fullObjectString.split(".");
  if (splitObjectString.length < 1) return;

  const variableName = splitObjectString[0];
  const variable = context.variables[variableName];
  if (!variable) return null;

  return createPartialVariable(variable, fullObjectString, context);
}
