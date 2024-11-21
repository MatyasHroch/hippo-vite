import {Context} from '../../types';
import {PossibleVariables} from '../../types';
import {createVariable} from "./variables";

export async function createContext (parentContext: Context = null){
    const newContext :any = {}
    newContext.variables = {}
    newContext.parent = null
    newContext.addVariable = function(name : string, value : string){
        return _addVariable(newContext, name, value);
    }

    return newContext as Context;
}

function _addVariable(context: Context, key: string, value: any) {
    context.variables[key] = createVariable(key, value);
}
