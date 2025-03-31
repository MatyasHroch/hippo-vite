import { Variable } from "./variable";
import { UserDefinedComponent } from "./component";
import { Watcher } from "./watcher";

export type Context = {
  // values
  id: number;

  // all variables created by the context itself
  variables: Record<string, Variable<any>>;

  // all variables that has been passed as a properties
  properties: Record<string, Variable<any>>;

  // key is name of the event and then there is an object
  handlers: HandlerStructures;

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
  addHandler: (
    handler: Function,
    eventName?: string,
    stopEvent?: boolean
  ) => HandlerStructure;
  emitEvent: (eventName, [...args]) => any;
};
