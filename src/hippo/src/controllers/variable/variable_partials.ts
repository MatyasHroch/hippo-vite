import { Variable } from "../../../types/variable";
import { Context } from "../../../types";
import { getGlobalContext } from "../globals";
import { createOriginVariable } from "./variable_main";
import { getVariableByName } from "../template/template_attributes";
import {_setVariableValue, setVariable} from "./variable_set";

// creates a partial variable of any variable
// it should work for object paths like "user.value.address.city" as for "user.address.city"
export function createPartialVariable<T>(
  originVariable: Variable<any>,
  objectPath: string,
  context?: Context,
  name?: string
) {
  context ??= getGlobalContext();
  name ??= objectPath;

  // TODO - make sure it works even with the value and also without it
  const path = objectPath.split("value.")[1];
  if (!path) {
    console.warn(`Invalid partial variable path the variable ${originVariable.name} while creating it, the path: ${objectPath}`);
    return null;
  }
  const keys = path.split(".");

  let currentValue = originVariable.value;
  let currentObjectOfValue: any ;
  if (!currentValue) return;

  for (const key of keys) {
    // if I get to some point where the key does not exist, the objectPath is invalid
    if (currentValue[key] === undefined) new Error(`Invalid path: ${path}`);
    currentObjectOfValue = currentValue
    currentValue = currentValue[key];
  }

  // TODO - find out if there is already the same partial, if it does, just return it instead of creating a new one
  let partialVariable = originVariable.partialVariables[path];
  if (!partialVariable) {
    partialVariable = createOriginVariable<T>(name, currentValue);
    // setting up the slots ??
    partialVariable.pathFromOrigin = path;
    partialVariable.originVariable = originVariable;
    originVariable.partialVariables[path] = partialVariable;

    // WHEN WE SET IT from the user or input, this function is called
    // DO NOT USE THIS .set TO AVOID CYCLES, IF IT IS NEEDED, PASS THE changedPartialPath PARAMETER,
    // SO WE KNOW, WE ARE CHANGING FROM THE APPLICATION
    partialVariable.set = async (value:T, changedPartialPath: string) =>{
        console.log("Editing from the parent, so now im gonna set my value")
        console.log("The value is this:")
        console.log({value})
        // await setVariable(context, partialVariable, value)

        // we set the value to the inner object, so now we can just set the variable with its own value
        const lastKey = keys[keys.length - 1];
        if (currentObjectOfValue && currentObjectOfValue[lastKey]){
          currentObjectOfValue[lastKey] = value
        }

        if (!changedPartialPath){
          // now we set the origin variable with its own value (we have changed the inner value)
          originVariable.set(originVariable.value, path)
        }

      // else {
      //   debugger
      //   console.log("Now i want to set this variable but i need to first call my father")
      //   // TODO - check if this is ok, but i think it is the only way
      //
      //   originVariable.set(originVariable.value, path)
      // }
    }

    // TODO - optimaze this, so the origin variable will know it should not look for other updates then in the path
    //  and be careful about infinite loop
    // originVariable.set = (value: T) => {
    //     const keys = path.split(".");
    //     const lastKey = keys.pop()
    //     let currentValue = originVariable.value;
    //     for (const key of keys) {
    //         if (key in currentValue) {
    //             return new Error(`Invalid path: ${path}`);
    //         }
    //         currentValue = currentValue[key];
    //     }
    //     currentValue[lastKey] = value;
    //     originVariable.set(originVariable.value)
    // }

    // TODO - set the partial done, but all the variables need to know, so the best way is to set the origin variable and
    // TODO - 1) if variable gets the path of partial, it should inform just the partials that are in the path
    // TODO - 2) so firstName will trigger only the firstName
    // TODO - 3) address.city will trigger address and address.city, it they exists
    // TODO - 4) so i will split it and then create longer and longer chain and always check if this partial path is in the origin
    // TODO - 5) we will change the behavior of the triggering the partials, that's it
    // TODO - 6) just need to set the whole origin variable



  }

  context.variables[partialVariable.name] = partialVariable;
  return partialVariable;
}

export function createPartialFromTemplateString(
  context: Context,
  fullObjectString: string,
  readOnly = false
) {
  const splitObjectString = fullObjectString.split(".");
  if (splitObjectString.length < 1) return;

  const variableName = splitObjectString[0];
  const variable = getVariableByName(context, variableName, false, readOnly);
  if (!variable) return null;

  return createPartialVariable(variable, fullObjectString, context);
}
