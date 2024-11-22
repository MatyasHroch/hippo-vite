import {createContext} from "./context";
import {Context} from "../../types";

export function createComponent(component: Function, parentContext: Context = null, elementToMount: Element = null){
    const newComponent:any = {}

    const newContext = createContext(parentContext)
    component(newContext)

    newComponent.context = newContext

    if (elementToMount) elementToMount.innerHTML = newComponent.template

    return newComponent
}