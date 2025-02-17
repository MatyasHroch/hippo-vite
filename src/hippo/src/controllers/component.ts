import {createContext} from "./context";
import {Context} from "../../types";
import {renderTemplate} from "./template/template_main";
import {Keywords} from "../../enums/keywords";

type ComponentStruct = {
    template?: Element | Node;
    context?: Context;
}

// TODO - should be renamed as process context
export async function processComponent(component: Function, parentContext: Context = null, elementToMount: Node = null, nodesToSlot: Array<Node> = null) {
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
    const renderTemplateResult = await renderTemplate(context.template, context);
    const renderedTemplate = renderTemplateResult.clonedTemplate;
    if (!renderedTemplate){
        console.warn("Template was not rendered properly in the component" + component.name);
        return newComponent;
    }
    newComponent.template
    context.template = renderedTemplate


    if (!elementToMount) {
        console.warn("No element to mount this component:" + component.name);
        return newComponent;
    }

    const childComponents = renderTemplateResult.childComponents;


    // MOUNT THE TEMPLATE
    // TODO 1) add my nodesToSlot to the template
    const slot = renderedTemplate.querySelector(Keywords.slot);
    if (slot){
        slot.append(...nodesToSlot);
    }
    // slot.remove();

    // TODO  2) remove all my html, that will be placed to the child process


    // TODO 3) speed it up, return it in the render template in the first place

    elementToMount.appendChild(context.template)

    // PROCESS ALL THE CHILDREN
    // now process the child components, after the attributes and the one way and two way bindings

    for(const child of childComponents) {
    console.log("childComponent " + child.name);
    console.log("it has this slots: " + child.nodesToSLot);
        await processComponent(child.component, context, child.tag, child.nodesToSLot);
    }

    return newComponent
}

function addSlots(component: ComponentStruct, htmlSlots: Array<Node>) {
    component.template
}
