import { Context } from "../../../types";
import { Variable } from "../../../types/variable";
import { getGlobalContext } from "../globals";
import {
  rerenderAttributes,
  rerenderDependencies,
  rerenderFor,
  rerenderIfNodes,
  rerenderPartials,
  rerenderTextNodes,
  setVariable,
} from "./variable_set";
import { Watcher } from "../../../types/watcher";

export function createOriginVariable<T = any>(
  name: string,
  value: T,
  context?: Context
) {
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
    forStructuresArray: [],
    pathFromOrigin: null,
    originVariable: null,
    partialVariables: {},
    updating: false,
    // TODO -add watcher

    addWatcher: () => {
      console.warn("This function 'addWatcher' is not initialized yet.");
    },

    set: async (value: T, partialPath : string = null) => {
      console.warn("This function 'set' is not initialized yet.");
    },
  };

  // USER FUNCTIONS
  originalVariable.set = function (value: T, partialPath : string = null) {
    // TODO - ts ignore
    return setVariable<T>(context, originalVariable, value, partialPath);
  };

  originalVariable.addWatcher = function (watcher: Watcher) {
    addWatcher(originalVariable, watcher);
  };

  // DEFAULT WATCHERS
  addWatcher(originalVariable, rerenderIfNodes);
  addWatcher(originalVariable, rerenderFor);
  addWatcher(originalVariable, rerenderTextNodes);
  addWatcher(originalVariable, rerenderAttributes);
  addWatcher(originalVariable, rerenderDependencies);
  addWatcher(originalVariable, rerenderPartials);

  return originalVariable;
}

export function addWatcher<T>(variable: Variable<T>, watcher: Watcher) {
  variable.watchers.push(watcher);
}

export function addComputed<T>(
  variableToDepend: Variable<T>,
  newComputedVariable: Variable<any>,
  computation: () => any
) {
  variableToDepend.addWatcher(async function () {
    await setVariable(
      newComputedVariable.context,
      newComputedVariable,
      computation()
    );
  });
}

function deleteVariable<T>(context: Context, variable: T) {
  return Error("Not Implemented");
}
