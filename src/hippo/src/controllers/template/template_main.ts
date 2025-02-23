import {Context} from "../../../types";
import {processNodes} from "./template_getters";


export async function renderTemplate(template:Element, context: Context) {
    // const clonedTemplate = template.cloneNode(true) as Element; // first we will clone it so we will not change the original template
    const clonedTemplate = template

    // for now, first get the nodes and attributes and then bind and model them
    // TODO - optimize this -> bind the text nodes and attributes while getting them
    // TODO bind and model all attributes
    // TODO render all text nodes (vars or props) inside the process
    const {textNodes, attributeNodes, childComponents} = processNodes(clonedTemplate, context);
    console.log(textNodes);

    // console.log("from the process nodes we have:")
    // console.log({textNodes})
    // console.log({attributeNodes})
    // console.log({childComponents})

    // bindAttributes(context, attributeNodes.toBind);
    // modelAttributes(context, attributeNodes.toModel);


    // TODO render all classes that uses variables or properties (vars or props)
    // const classNodes = getClassNodes(clonedTemplate);
    // renderClasses(classNodes, variables)

    return {clonedTemplate, childComponents};
}





