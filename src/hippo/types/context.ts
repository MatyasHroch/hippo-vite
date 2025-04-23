import {Variable, VariablesOf} from "./variable";
import { UserDefinedComponent } from "./component";
import { Watcher } from "./watcher";

export enum ContextType {
  regular = "regular",
  for = "for",
  if = "if"
}

export type Context = {
  // values
  id: number;

  // type of context
  type: ContextType;

  // all variables created by the context itself
  variables: Record<string, Variable<any>>;

  // all variables that has been passed as a properties
  properties: Record<string, Variable<any>>;

  // all variables that we need only on the first level
  temporaryVariables: Record<string, Variable<any>>;

  // key is name of the HANDLER and then there is an object with the handler itself
  handlers: HandlersStructure;

  //key is the name of the EVENT and then there is an object with the handler itself
  eventHandlers: EventHandlersStructure;

  // the context that should call their handlers from us
  subscribers: Record<string, Array<Context>>

  // context in which this context has been created
  parent: Context | null;

  // components to be created in this context
  childComponents: Record<string, UserDefinedComponent>;

  // template
  template?: Element;
  templateString?: string;

  // methods
  // TODO - describe the methods more, and do addVariables() and so on...
  addVariable: <T>(name: string, value: T) => Variable<T>;

  // TODO - better typing for objects of the variables
  addVariables: <T>(variables: T) => VariablesOf<T>;

  setTemplate: (htmlString: string) => Element | Node;
  addWatcher: (variable: Variable<any>, onUpdate: Watcher) => Function;
  addChildren: (
    children: Record<string, UserDefinedComponent>
  ) => Record<string, UserDefinedComponent>;
  addComputed: (
    computation: () => any,
    name?: string,
    dependencies?: Array<Variable<any>>
  ) => any;
  addHandlers: (
    handlers: Record<string, Function>,
    stopEvent?: boolean
  ) => Record<string, Function>;
  emitEvent: (eventName: string, ...args: unknown[]) => unknown;
};
