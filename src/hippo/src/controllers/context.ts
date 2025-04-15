import {Context, ContextType} from "../../types";
import {createOriginVariable} from "./variable/variable_main";
import {Variable} from "../../types/variable";
import {getNewId} from "./ids";
import {stringToHtml} from "./template/template_main_process";
import {UserDefinedComponent} from "../../types/component";
import {keysToUpper} from "../helpers/objects";
import {Watcher} from "../../types/watcher";
import {createComputedVariable} from "./variable/variable_computed";
import {emitEvent} from "./event";

export function createContext(
  parentContext: Context = null,
  id = null
): Context {
  const newContext: any = {};

  id ??= getNewId();
  // initial values
  newContext.id = id;
  newContext.type = "regular"

  newContext.variables = {};
  newContext.properties = {};
  newContext.temporaryVariables = {};

  newContext.handlers = {};
  newContext.eventHandlers = {};

  newContext.parent = parentContext;
  newContext.childComponents = {};

  // methods just called without the context for user
  newContext.setTemplate = function (htmlString: string) {
    return setTemplate(newContext, htmlString);
  };
  newContext.addWatcher = function (
    variable: Variable<any>,
    onUpdate: Watcher
  ) {
    return addWatcher(newContext, variable, onUpdate);
  };
  newContext.addChildren = function (
    children: Record<string, UserDefinedComponent>
  ) {
    return addChildren(newContext, children);
  };
  newContext.addVariable = function (name: string, value: string) {
    return addVariable(newContext, name, value);
  };
  newContext.addComputed = function (
    computation: () => any,
    name: string = null,
    dependencies: Array<Variable<any>>
  ) {
    return addComputed(newContext, computation, name, dependencies);
  };
  newContext.addHandlers = function (handlers: Record<string, Function>, stopEvent?: boolean) {
    if (handlers){
      return addHandlers(newContext, handlers, stopEvent);
    }
  };
  newContext.emitEvent = function (eventName: string, ...args: unknown[]) {
    emitEvent(newContext, eventName, ...args);
  };

  return newContext as Context;
}

// when we add Variable, it will be created and added to the variables object of the context
function addVariable(context: Context, key: string, value: any) {
  context.variables[key] = createOriginVariable(key, value, context);
  return context.variables[key];
}

function addComputed(
  context: Context,
  computation: () => any,
  name: string = null,
  dependencies: Array<Variable<any>>
) {
  const newComputed = createComputedVariable(
    context,
    computation,
    name,
    dependencies
  );
  context.variables[newComputed.name] = newComputed;
}

// when we set the template, it will be rendered
function setTemplate(context: Context, htmlString: string) {
  context.template = stringToHtml(htmlString);
}

// when we set the watcher via context, it will be then passed as a third argument to the user's on-update function
function addWatcher(
  context: Context,
  variable: Variable<any>,
  watcher: Watcher
) {
  addWatcher(context, variable, watcher);
  return watcher;
}

// we add the children, so then we could render them properly
function addChildren(
  context: Context,
  children: Record<string, UserDefinedComponent>
) {
  // TODO - prepare the components for render (later set the this to the context)
  // TODO - check that there are no children of the same name

  const upperCaseChildren = keysToUpper(children);

  context.childComponents = {
    ...context.childComponents,
    ...upperCaseChildren,
  };
  return children;
}

function addHandlers(
  context: Context,
  handlers: Record<string, Function>,
  stopEvent: boolean = false
) {
    for (const handlerName in handlers) {
      context.handlers[handlerName] = {
        handlerName: handlerName,
        handler: handlers[handlerName],
        stopEvent: stopEvent
      };
    }
}

export function cloneContext(context: Context, contextType :ContextType = null) {
  const newContext = createContext(context);

  newContext.variables = { ...context.variables };
  newContext.properties = { ...context.properties };
  newContext.handlers = { ...context.handlers };
  newContext.childComponents = { ...context.childComponents };
  newContext.template = { ...context.template };

  // for indicating
  contextType ??= ContextType.regular
  newContext.type = contextType

  return newContext;
}


export function isFakeForContext(context :Context){
  return context.type == ContextType.for
}