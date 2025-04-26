import {Context, ContextType} from "../../types";
import {addWatcher, createOriginVariable} from "./variable/variable_main";
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
  newContext.subscribers = {}

  newContext.parent = parentContext;
  newContext.childComponents = {};

  newContext.addVariable = function (name: string, value: string) {
    return addVariable(newContext, name, value);
  };

  // MAIN USER FUNCTIONS \\

  // MAIN FUNCTION FOR SETTING UP COMPONENT'S TEMPLATE
  newContext.setTemplate = function (htmlString: string) {
    return setTemplate(newContext, htmlString);
  };

  // FOR REGISTERING FUNCTIONS TO BE VISIBLE IN THE TEMPLATE
  newContext.addHandlers = function (handlers: Record<string, Function>, stopEvent?: boolean) {
    if (handlers){
      return addHandlers(newContext, handlers, stopEvent);
    }
  };

  // TO REGISTER OTHER COMPONENTS TO BE VISIBLE IN THE TEMPLATE
  newContext.addChildren = function (
      children: Record<string, UserDefinedComponent>
  ) {
    return addChildren(newContext, children);
  };

  // MAIN USER FUNCTION FOR ADDING VARIABLES
  newContext.addVariables = function (variableNameValues:Record<string, unknown>) {
    const result :Record<string, Variable<unknown>> ={};
    for (const variableName in variableNameValues) {
      result[variableName] = addVariable(newContext, variableName, variableNameValues[variableName]);
    }
    return result;
  };

  // MAIN USER FUNCTION FOR CREATING COMPUTED(DEPENDENT) VARIABLES ONE BY ONE
  newContext.addComputed = function (
      computation: () => any,
      templateName: string = null,
      dependencies: Array<Variable<any>>
  ) {
    return addComputed(newContext, computation, templateName, dependencies);
  };

  // MAIN USER FUNCTION FOR CREATING WATCHER - AFTER THE VARIABLE IS CHANGED THE ON-UPDATE FUNCTION WILL TRIGGER
  newContext.addWatcher = function (
      variable: Variable<any>,
      onUpdate: Watcher
  ) {
    return _addWatcher(newContext, variable, onUpdate);
  };

  // EMIT BUBBLE-TO-PARENTS EVENT
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

function addComputed<T>(
  context: Context,
  computation: () => T,
  name: string = null,
  dependencies?: Array<Variable<any>>
) {
  const newComputed = createComputedVariable(
    context,
    computation,
    name,
    dependencies
  );
  context.variables[newComputed.name] = newComputed;
  return newComputed;
}

// when we set the template, it will be rendered
function setTemplate(context: Context, htmlString: string) {
  context.template = stringToHtml(htmlString);
}

// when we set the watcher via context, it will be then passed as a third argument to the user's on-update function
function _addWatcher(
  context: Context,
  variable: Variable<any>,
  watcher: Watcher
) {
  addWatcher(variable, watcher);
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

// important function for specifying what the cloned context will have in common with the original one
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