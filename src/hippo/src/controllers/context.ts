import { Context } from "../../types";
import { createOriginVariable } from "./variable/variable_main";
import {Variable} from "../../types/variable";
import {getNewId} from "./ids";
import {stringToHtml} from "./template/template_getters";
import {Component} from "../../types/component";
import {keysToUpper} from "../helpers/objects";
import {Handler} from "../../types/handler";

export function createContext(parentContext: Context = null, id = null): Context {
  const newContext: any = {};

  id ??= getNewId();
  // initial values
  newContext.id = id
  newContext.variables = {};
  newContext.parent = parentContext;
  newContext.childComponents = {};

  // methods just called without the context for user
  newContext.addVariable = function (name: string, value: string) {
    return addVariable(newContext, name, value);
  };
  newContext.setTemplate = function (htmlString: string) {
    return setTemplate(newContext, htmlString);
  };
  newContext.addWatcher = function (variable: Variable<any>, onUpdate: Handler) {
    return addWatcher(newContext, variable, onUpdate);
  }
  newContext.addChildren = function (children: Record<string, Component>) {
    return addChildren(newContext, children);
  }

  return newContext;
}

// when we add Variable, it will be created and added to the variables object of the context
function addVariable(context: Context, key: string, value: any) {
  context.variables[key] = createOriginVariable(key, value, context);
  return context.variables[key];
}

// when we set the template, it will be rendered
function setTemplate(context: Context, htmlString: string) {
  context.template = stringToHtml(htmlString);
}

// when we set the watcher via context, it will be then passed as a third argument to the user's on-update function
function addWatcher(context: Context, variable: Variable<any>, handler: Handler) {
  variable.watchers.push(handler);
  return handler
}

// we add the children, so then we could render them properly
function addChildren(context: Context, children: Record<string,Component>){
  // TODO - prepare the components for render (later set the this to the context)
  // TODO - check that there are no children of the same name

  const upperCaseChildren = keysToUpper(children)

  context.childComponents = {
    ...context.childComponents,
    ...upperCaseChildren
  };
  return children;
}

