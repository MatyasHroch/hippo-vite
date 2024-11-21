import {createContext} from "./context";
import {render} from "./template";

export async function createComponent(component: Function, elementToMount: Element = null){
    const newComponent:any = {}
    const newContext = await createContext()
    component(newContext)

    newComponent.context = newContext

    if(newContext.templatePath){
        newComponent.template = await render(newContext)
    }

    if (elementToMount){
        elementToMount.innerHTML = newComponent.template
    }

    return newComponent
}