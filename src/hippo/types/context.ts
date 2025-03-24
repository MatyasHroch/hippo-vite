import {Variable} from "./variable";
import {UserDefinedComponent} from "./component";
import {Handler} from "./handler";

export type Context = {
  // values
  id: number,
  variables: Record<string, Variable<any>>;
  parent: Context | null;
  childComponents:  Record<string, UserDefinedComponent>;

  // template
  template?: Element;
  templateString?: string;

  // methods
  // TODO - describe the methods more, and do addVariables
  addVariable: <T>(name : string, value: T) => Variable<T>;
  setTemplate: (htmlString: string) => Element | Node;
  addWatcher: (variable: Variable<any>, onUpdate: Handler) => Function;
  addChildren: (children: Record<string,UserDefinedComponent>) => Record<string,UserDefinedComponent>;
};
