import {createContext} from "./context";
import {Context} from "../../types";
import {renderTemplate} from "./template/template_main";

type ComponentStruct = {
    template?: Element | Node;
    context?: Context;
}

// TODO - should be renamed as process context
export async function processComponent(component: Function, parentContext: Context = null, elementToMount: Element = null){
    const context = createContext(parentContext);
    const newComponent : ComponentStruct = {
        context: context,
    };

    // USER FUNCTION COMPONENT, !!! warning, can be async
    // TODO - what could the component function return?
    await component(context)

    // PROCESS THE TEMPLATE

    // Check if there is any
    if (!context.template){
        console.warn("This component has no Template:" + component.name);
        return newComponent;
    }

    // Render the template
    const renderedTemplate = renderTemplate(context.template, context);
    if (renderedTemplate){
        console.warn("Template was not rendered properly in the component" + component.name);
        return newComponent;
    }
    if (elementToMount) {
        console.warn("No element to mount this component:" + component.name);
        return newComponent;
    }

    // MOUNT THE TEMPLATE
    elementToMount.appendChild(context.template)
    return newComponent
}