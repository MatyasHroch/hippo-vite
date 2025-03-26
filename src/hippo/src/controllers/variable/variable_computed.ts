import { Variable } from "../../../types/variable";
import { Context } from "../../../types";
import { addComputed, createOriginVariable } from "./variable_main";
import { getNewId } from "../ids";

export function createComputedVariable(
  context: Context,
  computation: () => any,
  name: string = null,
  dependencies: Array<Variable<any>> = null
): Variable<any> {
  if (!computation) {
    throw new Error("Computation function cannot be null or undefined");
  }

  // If dependencies not provided, try to detect them
  if (!dependencies) {
    dependencies = [];
    try {
      const bodyString = computation.toString();
      const bodyOnly = bodyString.slice(
        bodyString.indexOf("{") + 1,
        bodyString.lastIndexOf("}")
      );
      // Match both .value and direct variable references
      const matches = [
        ...bodyOnly.matchAll(/\b(\w+)\.value\b/g),
        ...bodyOnly.matchAll(/\b(\w+)\b/g),
      ].map((m) => m[1]);

      for (const match of matches) {
        const variable = context.variables[match];
        if (variable && !dependencies.includes(variable)) {
          dependencies.push(variable);
        }
      }
    } catch (error) {
      console.warn("Could not detect dependencies automatically:", error);
    }
  }

  name ??= `computed-${getNewId()}`;
  const value = computation();
  const newComputedVariable = createOriginVariable(name, value, context);

  // Override set to prevent direct updates
  newComputedVariable.set = () => {
    throw new Error(
      "Computed variables cannot be set directly. Update their dependencies instead."
    );
  };

  // Add watchers to all dependencies
  for (const dependency of dependencies) {
    addComputed(dependency, newComputedVariable, computation);
  }

  return newComputedVariable;
}
