import string from "vite-plugin-string";
export type PartialVariable<T> = {
  // identifiers
  name: string;
  fullName: string;
  contextId: number;

  // vals
  val: T;
  previousValue: T;

  onUpdates: Array<Function>; // functions that activates when the variable is changed

  inputNodes: Array<HTMLInputElement>; // two-way binding - input, select and textarea
  textNodes: Array<Text>; // one-way binding - variables rendered as a string
  attributes: Array<Attr>; // one-way binding - variables as attributes

  ifNodes: Array<HTMLElement>; // nodes that will be removed if the variable is not truly
  showNodes: Array<HTMLElement>; // nodes that will be given display none if the val is not truly

  pathFromOrigin: string | null;
  originVariable: PartialVariable<any> |null;
  partialVariables: Record<string, PartialVariable<any>>;

  updating: boolean;
};

function createPartialVariable<T>(
  originVariable: PartialVariable<any>,
  objectPath: string,
  name?: string
) {
  const contextId = originVariable.contextId;
  name ??= objectPath.split(".").pop();

  const path = objectPath.split("val.")[1];
  const keys = objectPath.split(".");

  let currentValue = originVariable.val;
  if (!currentValue) return;

  for (const key of keys) {
    // if I get to some point where the key does not exist, the objectPath is invalid
    if (currentValue[key] === undefined) return new Error(`Invalid path: ${path}`);
    currentValue = currentValue[key];
  }

  // TODO - check the type T here

  const partialVariable: PartialVariable<any> = {
    name,
    contextId,
    fullName: objectPath + `-${contextId}`,
    val: currentValue,
    previousValue: originVariable.previousValue,
    onUpdates: [],
    inputNodes: [],
    textNodes: [],
    attributes: [],
    ifNodes: [],
    showNodes: [],
    pathFromOrigin: path,
    originVariable,
    partialVariables: {},
    updating: false,
  };

  originVariable.partialVariables[path] = partialVariable;

  return partialVariable;
}

function createOriginVariable<T>(name: string, val: T, contextId?: number) {
  contextId ??= 0;

  const originalVariable: PartialVariable<any> = {
    name,
    contextId,
    fullName: name + `-${contextId}`,
    val: val,
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
