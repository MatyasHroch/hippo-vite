import string from "vite-plugin-string";
import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import {getGlobalContext} from "../globals";
import {
  rerenderAttributes,
  rerenderDependencies, rerenderFor, rerenderIfNodes,
  rerenderPartials,
  rerenderTextNodes,
  setVariable
} from "./variable_set";


export function createOriginVariable<T = any>(name: string, value: T, context?: Context) {
  // when no context id provided, we give it to the global context, which is 0
  context ??= getGlobalContext();
  const contextId = context.id;

  const originalVariable: Variable<T> = {
    name,
    contextId,
    context: context,
    fullName: name + `-${contextId}`,
    value: value,
    previousValue: null,
    watchers: [],
    inputNodes: [],
    textNodes: [],
    attributes: [],
    ifNodes: [],
    showNodes: [],
    pathFromOrigin: null,
    originVariable: null,
    partialVariables: {},
    updating: false,

    // @ts-ignore
    set: () => {
      console.log("Setter not initialized yet")
    }
  };

  // @ts-ignore
  originalVariable.set = function <T>(value:T){
    // TODO - ts ignore
    return setVariable<T>(    // @ts-ignore
        context, originalVariable, value);
  }

  context.addWatcher(originalVariable, rerenderIfNodes)
  context.addWatcher(originalVariable, rerenderFor)
  context.addWatcher(originalVariable, rerenderTextNodes)
  context.addWatcher(originalVariable, rerenderAttributes);
  context.addWatcher(originalVariable, rerenderDependencies);
  context.addWatcher(originalVariable, rerenderPartials)

  return originalVariable;
}


function deleteVariable<T>(context: Context, variable: T){
  return Error("Not Implemented")
}

