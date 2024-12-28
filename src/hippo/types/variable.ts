export type Variable<T> = {
    // identifiers
  name: string;
  fullName: string;
  contextId: number;

  // values
  value: T;
  previousValue: any;

  onUpdates: Array<Function>; // functions that activates when the variable is changed

  inputNodes: Array<HTMLInputElement>; // two-way binding - input, select and textarea
  textNodes: Array<Text>;  // one-way binding - variables rendered as a string
  attributes: Array<Attr>; // one-way binding - variables as attributes

  ifNodes: Array<HTMLElement>; // nodes that will be removed if the variable is not truly
  showNodes: Array<HTMLElement>; // nodes that will be given display none if the value is not truly

  parentVariable: Variable<any>;
  childrenVariables: Record<string, Variable<any>> | null;

  updating: boolean;
} & (T extends object ? { [K in keyof T]: Variable<T[K]> } : {});



// export type Variable = {
//   // identifiers
//   name: string;
//   fullName: string;
//   contextId: number;
//
//   // values
//   value: any;
//   previousValue: any;
//
//   onUpdates: Array<Function>; // functions that activates when the variable is changed
//
//   inputNodes: Array<HTMLInputElement>; // two-way binding - input, select and textarea
//   textNodes: Array<Text>;  // one-way binding - variables rendered as a string
//   attributes: Array<Attr>; // one-way binding - variables as attributes
//
//   ifNodes: Array<HTMLElement>; // nodes that will be removed if the variable is not truly
//   showNodes: Array<HTMLElement>; // nodes that will be given display none if the value is not truly
//
//   parentVariable: Variable;
//   childrenVariables: Array<Variable> | null;
//
//   updating: boolean;
// };

