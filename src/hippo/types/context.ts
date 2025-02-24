import {Variable} from "./variable";
import {Component} from "./component";
import {Handler} from "./handler";

export type Context = {
  // values
  id: number,
  variables: Record<string, Variable<any>>;
  parent: Context | null;
  childComponents:  Record<string, Component>;

  // template
  template?: Element;
  templateString?: string;

  // methods
  // TODO - describe the methods more, and do addVariables
  addVariable: <T>(name : string, value: T) => Variable<T>;
  setTemplate: Function;
  addWatcher: (variable: Variable<any>, onUpdate: Handler) => Function;
  addChildren: (children: Record<string,Component>) => Record<string,Component>;
};
