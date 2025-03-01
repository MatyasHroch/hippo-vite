import {Context} from "../../../types";
import {bindAttribute, isAttributeToBind, isAttributeToModel, modelAttribute} from "./template_attributes";
import {Component} from "../../../types/component";
import {bindTextNode} from "./template_text_nodes";

type ChildrenArray = Array<{
    tag: Node,
    component: Component,
    nodesToSLot? : Array<Node>,
    slot? : Node,
    name? : string
}>;

export function processNodes(node: Element, context: Context) {
    const textNodes: Array<Element> = [];
    // All elements with attributes starting with "bind:" or "model:"
    const attributeNodes = {
        toBind: [],
        toModel: []
    };
    // all components that should be rendered after all the bindings
    const childComponents :ChildrenArray = [];

    // TODO - if and else solve here
    // TODO - h-for solve here

    // if the node is component, we skip the bindings, leave it to the high level function
    const isComponent = !!context.childComponents[node.tagName]
    if (isComponent){
        const component = context.childComponents[node.nodeName];
        childComponents.push({
            name: component.name,
            tag: node,
            component: component,
            nodesToSLot: [...node.childNodes]
        });
        // console.log("We got to the child node:" + node);
        // console.log("We got to the component:" + component);

        // TODO - make sure, that only this concrete tag is skipped, inner html may be processed normally - DONE
        // TODO - Process the children after all is done - DONE
        // TODO - make sure that all the inside html is properly mount to the SLOT
    }

    // find attributes to bind and model and bind them and model them
    if (!isComponent && node.attributes && node.attributes.length > 0) {
        for(const attr of node.attributes) {
            if (isAttributeToBind(attr)){
                attributeNodes.toBind.push(node)
                // TODO really bind them
                bindAttribute(context, attr, node);
            }
            if(isAttributeToModel(attr)){
                attributeNodes.toModel.push(node)
                // TODO model bind them
                modelAttribute(context, attr, node);
            }
        }
    }

    // Here we recursively go to the next nodes
    if (node.childNodes.length > 0) { // when the node is not a leaf
        for (const childNode of node.childNodes) {
            // // check if we can cast the Node to the Element
            // if (childNode.nodeType !== Node.ELEMENT_NODE) continue;

            // TODO - find out if this is ok: "childNode as Element"
            // recursively add all the textNodes and attributes to bind
            const result = processNodes(childNode as Element, context);
            textNodes.push(...result.textNodes);
            attributeNodes.toBind.push(...attributeNodes.toBind);
            attributeNodes.toModel.push(...attributeNodes.toModel);
            childComponents.push(...result.childComponents)
        }
    } else if (!isComponent && node.nodeType == Node.TEXT_NODE  && node.textContent !== "") {
            // when the node is a leaf so we can inspect the text nodes
            bindTextNode(context, node)
            textNodes.push(node);
        }

    return {
        textNodes,
        attributeNodes,
        childComponents
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