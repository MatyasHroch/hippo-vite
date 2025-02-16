export type Variable<T> = {
  // identifiers
  name: string;
  fullName: string;
  contextId: number;

  // TODO does it make sense?
  // context: Context

  // values
  value: T;
  previousValue: T | undefined;

  onUpdates: Array<Function>; // functions that activates when the variable is changed

  inputNodes: Array<HTMLInputElement>; // two-way binding - input, select and textarea
  textNodes: Array<Text>; // one-way binding - variables rendered as a string
  attributes: Array<Attr>; // one-way binding - variables as attributes

  ifNodes: Array<HTMLElement>; // nodes that will be removed if the variable is not truly
  showNodes: Array<HTMLElement>; // nodes that will be given display none if the value is not truly

  // only when it has a partial variable
  pathFromOrigin: string | null;
  originVariable: Variable<any> |null;

  // only when it has a partial variables
  partialVariables: Record<string, Variable<any>>;

  //
  updating: boolean;
};