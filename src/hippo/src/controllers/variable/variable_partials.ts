import {Variable} from "../../../types/variable";
import string from "vite-plugin-string";
import {Context} from "../../../types";
import {getGlobalContext} from "../globals";
import {createOriginVariable} from "./variable_main";

// creates a partial variable of any variable
// it should work for object paths like "user.value.address.city" as for "user.address.city"
export function createPartialVariable<T>(
    originVariable: Variable<any>,
    objectPath: string,
    context?: Context,
    name?: string
) {
    // TODO - does it make sense?
    // contextId = originVariable.contextId;

    context ??= getGlobalContext();
    name ??= objectPath

    // TODO - make sure it works even with the value and also without it
    const path = objectPath.split("value.")[1];
    const keys = path.split(".");

    let currentValue = originVariable.value;
    if (!currentValue) return;

    for (const key of keys) {
        // if I get to some point where the key does not exist, the objectPath is invalid
        if (currentValue[key] === undefined) new Error(`Invalid path: ${path}`);
        currentValue = currentValue[key];
    }

    // TODO - find out if there is already the same partial, if it does, just return it instead of creating a new one
    const alreadyExistingPartial = originVariable.partialVariables[path];

    const partialVariable = alreadyExistingPartial
        ? alreadyExistingPartial
        : createOriginVariable<T>(name, currentValue);

    originVariable.partialVariables[path] = partialVariable;
    context.variables[partialVariable.name] = partialVariable;

    return partialVariable;
}

export function createPartialFromTemplateString(context: Context, fullObjectString:string, readOnly = false){
    const splittedObjectString = fullObjectString.split(".");
    if (splittedObjectString.length < 1) return;

    const variableName = splittedObjectString[0];
    const variable = context.variables[variableName];
    if (!variable) return null;

    return createPartialVariable(variable, fullObjectString, context)
}