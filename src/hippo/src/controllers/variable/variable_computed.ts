import {Variable} from "../../../types/variable";
import {Context} from "../../../types";
import {addComputed, createOriginVariable} from "./variable_main";
import {getNewId} from "../ids";

export function createComputedVariable(context: Context, computation: () => any, name: string = null, dependencies: Array<Variable<any>>){
    if (!dependencies){
        // TODO - find out the variables from the expression by using the ".value" - DONE?
        dependencies = [];

        const bodyString = computation.toString();
        const bodyOnly = bodyString.slice(bodyString.indexOf("{") + 1, bodyString.lastIndexOf("}"));
        const matches = [...bodyOnly.matchAll(/\b(\w+)\.value\b/g)].map(m => m[1]);

        for (const match of matches) {
            const variable = context.variables[match]
            if (variable) {
                dependencies.push(variable)
            }
        }

        // return console.warn('Dependencies not found. Not implemented yet without errors');
    }

    name ??= getNewId() + "-computed"
    const value = computation();
    const newComputedVariable = createOriginVariable(name, value , context);

    newComputedVariable.set = () => {
        console.warn("You cannot set a Computed variable. Use new variable and a Watcher")
    }

    for (const variable of dependencies){
        addComputed(variable, newComputedVariable, computation);
    }
}