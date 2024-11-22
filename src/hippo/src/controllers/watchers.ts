import {Variable} from "../../types/variable";
import {Context} from "../../types";

// creates an onUpdate function and pushes it to the variable's watchers
export function createWatcher(variable: Variable, onUpdate: Function, context: Context) {
    return function newOnUpdate(){
        // provided function will be called with newValue, previousValue and a context where the watcher was created at
        return onUpdate(variable.value, variable.previousValue, context);
    }
}
