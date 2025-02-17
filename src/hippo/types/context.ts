import {Variable} from "./variable";
import {createWatcher} from "../src/controllers/watchers";
import {Component} from "./component";

export type Context = {
  // values
  id: number,
  variables: Record<string, any>;
  parent: Context | null;
  childComponents:  Record<string, Component>;

  // template
  template?: Element;
  templateString?: string;

  // methods
  // TODO - describe the methods more
  addVariable: Function;
  setTemplate: Function;
  addWatcher: (variable: Variable<any>, onUpdate: Function) => Function;
  addChildren: (children: Record<string,Component>) => Record<string,Component>;
};
