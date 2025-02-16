import {Keywords} from "../../../enums/keywords";
import {Context} from "../../../types";
import {bindTextNodes} from "./template_text_nodes";
import {bindAttribute, modelAttribute} from "./template_attributes";
import {processNodes} from "./template_getters";


export function renderTemplate(template:Element, context: Context) {
    // const clonedTemplate = template.cloneNode(true) as Element; // first we will clone it so we will not change the original template
    const clonedTemplate = template

    // TODO - optimize this -> bind the text nodes and attributes while getting them
    // for now, first get the nodes and attributes and then bind and model them
    const {textNodes, attributeNodes} = processNodes(clonedTemplate, context);

    // TODO bind and model all attributes
    // bindAttributes(context, attributeNodes.toBind);
    // modelAttributes(context, attributeNodes.toModel);

    // TODO render all text nodes (vars or props)
    bindTextNodes(context, textNodes);

    // TODO render all classes that uses variables or properties (vars or props)
    // const classNodes = getClassNodes(clonedTemplate);
    // renderClasses(classNodes, variables)

    return clonedTemplate;
}





