import { Variable } from "../../../types/variable";
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
): Variable<T> {
  if (!originVariable) {
    throw new Error("Origin variable cannot be null or undefined");
  }

  if (!objectPath) {
    throw new Error("Object path cannot be empty");
  }

  context ??= getGlobalContext();
  name ??= objectPath;

  // Handle both with and without "value." prefix
  const path = objectPath.includes("value.")
    ? objectPath.split("value.")[1]
    : objectPath;

  const keys = path.split(".");
  let currentValue = originVariable.value;

  if (currentValue === null || currentValue === undefined) {
    throw new Error(
      `Cannot create partial variable: origin variable value is ${currentValue}`
    );
  }

  // Validate path exists
  for (const key of keys) {
    if (currentValue[key] === undefined) {
      throw new Error(`Invalid path: ${path} - key "${key}" does not exist`);
    }
    currentValue = currentValue[key];
  }

  // Check if partial already exists
  let partialVariable = originVariable.partialVariables[path];
  if (!partialVariable) {
    partialVariable = createOriginVariable<T>(name, currentValue);
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
): Variable<any> | null {
  if (!fullObjectString) {
    throw new Error("Full object string cannot be empty");
  }

  const splitObjectString = fullObjectString.split(".");
  if (splitObjectString.length < 1) {
    throw new Error("Invalid object string format");
  }

  const variableName = splitObjectString[0];
  const variable = context.variables[variableName];

  if (!variable) {
    console.warn(`Variable "${variableName}" not found in context`);
    return null;
  }

  return createPartialVariable(variable, fullObjectString, context);
}
