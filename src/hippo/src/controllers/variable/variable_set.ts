import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import string from "vite-plugin-string";

// this function actually sets the value
export function setVariableValue<T>(context: Context, variable: Variable<T>, value: T){
    variable.previousValue = variable.value;
    variable.value = value;
}

export function setVariable<T>(context: Context, variable: Variable<T>, value: T){
    setVariableValue(context, variable, value);

    for (const watcher of variable.watchers) {
        watcher(context, variable, value);
    }
    return variable;
}

export function rerenderTextNodes<T>(context: Context, variable: Variable<T>, value: T){
    for (const node of variable.textNodes) {
        // changing just the text content
        node.textContent = variable.value as string;
    }
    return variable;
}

export function rerenderDependencies<T>(variable: Variable<T>){
    // TODO - rerender the Dependencies
    console.log("// TODO - rerender the Dependencies")
}