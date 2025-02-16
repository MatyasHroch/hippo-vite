import { Context } from "../../types";
import { createOriginVariable, createPartialVariable } from "./variable";
import {Variable} from "../../types/variable";
import {getNewId} from "./ids";
import {createWatcher} from "./watchers";
import {stringToHtml} from "./template/template_getters";

export function createContext(parentContext: Context = null): Context {
  const newContext: any = {};

  // initial values
  newContext.id = getNewId()
  newContext.variables = {};
  newContext.parent = parentContext;

  // methods
  newContext.addVariable = function (name: string, value: string) {
    return _addVariable(newContext, name, value);
  };
  newContext.setTemplate = function (htmlString: string) {
    return _setTemplate(newContext, htmlString);
  };
  newContext.addWatcher = function (variable: Variable<any>, onUpdate: Function) {
    return _addWatcher(newContext, variable, onUpdate);
  }

  return newContext;
}

// when we add Variable, it will be created and added to the variables object of the context
function _addVariable(context: Context, key: string, value: any) {
  context.variables[key] = createOriginVariable(key, value, context.id);
}

// when we set the template, it will be rendered
function _setTemplate(context: Context, htmlString: string) {
  context.template = stringToHtml(htmlString);
}

// when we set the watcher via context, it will be then passed as a third argument to the user's on-update function
function _addWatcher(context: Context, variable: Variable<any>, onUpdate: Function) {
  createWatcher(variable, onUpdate, context);
}
