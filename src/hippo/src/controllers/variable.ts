import string from "vite-plugin-string";
import {Context} from "../../types";
import {Variable} from "../../types/variable";


export function createPartialVariable<T>(
  originVariable: Variable<any>,
  objectPath: string,
  contextId?: number,
  name?: string
) {
  // TODO - does it make sense?
  // contextId = originVariable.contextId;

  contextId ??= 0;
  name ??= objectPath.split(".").pop();


  const path = objectPath.split("value.")[1];
  const keys = path.split(".");

  let currentValue = originVariable.value;
  if (!currentValue) return;

  for (const key of keys) {
    // if I get to some point where the key does not exist, the objectPath is invalid
    if (currentValue[key] === undefined) new Error(`Invalid path: ${path}`);
    currentValue = currentValue[key];
  }

  const partialVariable = createOriginVariable<T>(name, currentValue, contextId);
  originVariable.partialVariables[path] = partialVariable;

  return partialVariable;
}

export function createOriginVariable<T = any>(name: string, value: T, contextId?: number) {
  // when no context id provided, we give it to the global context, which is 0
  contextId ??= 0;

  const originalVariable: Variable<T> = {
    name,
    contextId,
    fullName: name + `-${contextId}`,
    value: value,
    previousValue: null,
    onUpdates: [],
    inputNodes: [],
    textNodes: [],
    attributes: [],
    ifNodes: [],
    showNodes: [],
    pathFromOrigin: null,
    originVariable: null,
    partialVariables: {},
    updating: false,
  };
  return originalVariable;
}
