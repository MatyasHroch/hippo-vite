import {Context} from "../../../types";
import {processNodes} from "./template_getters";


export async function renderTemplate(template:Element, context: Context, nodesToSLot: Array<Element> = null) {
    // const clonedTemplate = template.cloneNode(true) as Element; // first we will clone it so we will not change the original template
    const clonedTemplate = template
    // TODO - optimize this -> bind the text nodes and attributes while getting them - DONE
    // TODO bind and model all attributes - DONE
    // TODO render all text nodes (vars or props) inside the process - DONE
    const {textNodes, attributeNodes, childComponents} = await processNodes(clonedTemplate, context, nodesToSLot);

    return {clonedTemplate, childComponents};
}

export function cloneElement<T extends Element>(element: T): T {
    return element.cloneNode(true) as T;
}