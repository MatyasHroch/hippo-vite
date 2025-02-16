import {createContext} from "./context";
import {Context} from "../../types";

// TODO - should be renamed as process context
export function processComponent(component: Function, parentContext: Context = null, elementToMount: Element = null){
    const newComponent:any = {}

    const newContext = createContext(parentContext)
    component(newContext)

    newComponent.context = newContext

    if (elementToMount && newContext.template) elementToMount.appendChild(newContext.template)

    return newComponent
}