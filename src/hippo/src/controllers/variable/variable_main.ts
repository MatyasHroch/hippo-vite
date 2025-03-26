import string from "vite-plugin-string";
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
): Variable<T> {
  if (!name) {
    throw new Error("Variable name cannot be empty");
  }

  // when no context id provided, we give it to the global context, which is 0
  context ??= getGlobalContext();
  const contextId = context.id;

  const originalVariable: Variable<T> = {
    name,
    contextId,
    context: context,
    fullName: `${name}-${contextId}`,
    value,
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

    addWatcher: (watcher: Watcher) => {
      if (!watcher) {
        throw new Error("Watcher cannot be null or undefined");
      }
      addWatcher(originalVariable, watcher);
    },

    set: (newValue: T) => {
      if (originalVariable.updating) {
        console.warn(
          "Attempted to update variable while it was already updating"
        );
        return;
      }
      return setVariable<T>(context, originalVariable, newValue);
    },
  };

  // DEFAULT WATCHERS
  addWatcher(originalVariable, rerenderIfNodes);
  addWatcher(originalVariable, rerenderFor);
  addWatcher(originalVariable, rerenderTextNodes);
  addWatcher(originalVariable, rerenderAttributes);
  addWatcher(originalVariable, rerenderPartials);

  return originalVariable;
}

function addWatcher<T>(variable: Variable<T>, watcher: Watcher) {
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
