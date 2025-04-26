import {Computed, Variable} from "../../../types/variable";
import { Context } from "../../../types";
import { addComputed, createOriginVariable } from "./variable_main";
import { getNewId } from "../ids";

export function createComputedVariable<T>(
  context: Context,
  computation: () => T,
  name: string = null,
  dependencies: Array<Variable<any>>
) : Computed<T> {
  if (!dependencies) {
    dependencies = [];

    const bodyString = computation.toString();
    const bodyOnly = bodyString.slice(
      bodyString.indexOf("{") + 1,
      bodyString.lastIndexOf("}")
    );
    const matches = [...bodyOnly.matchAll(/\b(\w+)\.value\b/g)].map(
      (m) => m[1]
    );

    for (const match of matches) {
      const variable = context.variables[match];
      if (variable) {
        dependencies.push(variable);
      }
    }
  }

  name ??= getNewId() + "-computed";
  const value = computation();
  const temporaryComputedVariable = createOriginVariable<T>(name, value, context);
  const newComputedVariable = toComputed(temporaryComputedVariable)

  // @ts-ignore
  // newComputedVariable.set = () => {
  //   console.warn(
  //     "You cannot set a Computed variable. Use a new variable and a Watcher"
  //   );
  // };

  for (const variable of dependencies) {
    addComputed(variable, newComputedVariable, computation);
  }

  return newComputedVariable;
}

function toComputed<T>(variable: Variable<T>): Computed<T> {
  // Remove the 'set' property and cast as Computed
  const { set, ...rest } = variable;
  return rest as Computed<T>;
}