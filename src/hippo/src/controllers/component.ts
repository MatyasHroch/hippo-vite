import {createContext} from "./context";
import {Context} from "../../types";
import {renderTemplate} from "./template/template_main";

type Component = {
    template?: Element | Node;
    context?: Context;
}

// TODO - should be renamed as process context
export async function processComponent(component: Function, parentContext: Context = null, elementToMount: Element = null){
    const newComponent = {
        context: createContext(parentContext),
    };

    const {context} = newComponent;

    // USER FUNCTION COMPONENT, !!! warning, can be async
    await component(context)

    // PROCESS THE TEMPLATE
    if (context.template) {
        // RENDER THE TEMPLATE
        const renderedTemplate = renderTemplate(context.template, context);
        if (renderedTemplate && elementToMount) {
            // MOUNT THE TEMPLATE
            elementToMount.appendChild(context.template)
        }
        else {
            console.warn("No element to mount this component:" + component.name);
        }
    }
    else {
        console.warn("This component has no Template:" + component.name);
    }

    return newComponent
}