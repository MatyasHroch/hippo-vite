import {Context} from "../../../types";
import {bindAttribute, isAttributeToBind, isAttributeToModel, modelAttribute} from "./template_attributes";

export function processNodes(node: Element, context: Context) {
    const textNodes: Array<Element> = [];

    // All elements with attributes starting with "bind:" or "model:"
    const attributeNodes = {
        toBind: [],
        toModel: []
    };

    if (node.childNodes.length > 0) {
        for (const childNode of node.childNodes) {
            // check if we can cast the Node to the Element
            if (childNode.nodeType !== Node.ELEMENT_NODE) continue;

            // recursively add all the textNodes and attributes to bind
            const result = processNodes(childNode as Element, context);
            textNodes.push(...result.textNodes);
            attributeNodes.toBind.push([...attributeNodes.toBind]);
            attributeNodes.toModel.push([...attributeNodes.toModel]);
        }
    } else {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node);
        }

        // find attributes to bind and model and bind them and model them
        if (node.attributes && node.attributes.length > 0) {
            for(const attr of node.attributes) {
                if (isAttributeToBind(attr)){
                    attributeNodes.toBind.push(node)
                    // TODO really bind them
                    bindAttribute(context, attr);
                }
                // TODO find and push attributes to model
                if(isAttributeToModel(attr)){
                    attributeNodes.toModel.push(node)
                    // TODO model bind them
                    modelAttribute(context, attr);
                }
            }
        }

    }

    return {
        textNodes,
        attributeNodes
    };
}

export function stringToHtml(htmlString: string){
    const div = document.createElement("div")
    div.innerHTML = htmlString;
    return div.firstElementChild;
}

export function findVariables(node: Node) {
    return node.textContent.match(/{{\s*[\w.]+\s*}}/g);
}

export function variableNameFromCurlyBraces(text: string) {
    return text.slice(2, -2).trim();
}