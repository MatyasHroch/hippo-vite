import {Context} from "../../../types";
import {bindAttribute, isAttributeToBind, isAttributeToModel, modelAttribute} from "./template_attributes";
import {Component} from "../../../types/component";
import {bindTextNode} from "./template_text_nodes";
import {createPartialFromTemplateString} from "../variable/variable_partials";
import {Keywords} from "../../../enums/keywords";
import {generateDerenderIf, generateRenderIf, getIfPlaceholderTag} from "./template_if_nodes";

type ChildrenArray = Array<{
    tag: Node,
    component: Component,
    nodesToSLot? : Array<Node>,
    slot? : Node,
    name? : string
}>;

export async function processNodes(node: Element, context: Context, nodesToSlot: Array<Node> = null) {
    const textNodes: Array<Element> = [];
    // All elements with attributes starting with "bind:" or "model:"
    const attributeNodes = {
        toBind: [],
        toModel: []
    };
    // all components that should be rendered after all the bindings
    const childComponents :ChildrenArray = [];

    // TODO - if and else solve here
    if (node.attributes && node.attributes.getNamedItem(Keywords.if)) {
        const ifAttribute = node.attributes.getNamedItem(Keywords.if)
        // TODO - here implement some syntactic sugar for the library users
        // TODO - nest this to some function please
        const variableName = ifAttribute.value.trim()
        const variable = context.variables[variableName]
        if (!variable) Error("Variable with name " + variableName + " has not found");

        // put a placeholder after the node, then remove the node
        const placeholderDiv = getIfPlaceholderTag()

        const derenderIf = generateDerenderIf(node, placeholderDiv, ifAttribute)
        const renderIf = generateRenderIf(context, node, placeholderDiv, nodesToSlot)

        await derenderIf();

        variable.ifNodes.push({
            placeholderNode: node,
            renderIf,
            derenderIf
        })

        // when the variable is truly, we
        if (variable.value){
            console.log("Here we have a truly if node")
            await renderIf()
        }
        else {
            await derenderIf();
            console.log("Here we have a falsy if node")
        }

        // TODO - node and context to a function, which will process the node and then removes the father node
        // TODO - if value True, just continue the rendering
        // TODO - if value False, remove the inner html and replace it with the

    }

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
            const result = await processNodes(childNode as Element, context);
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

export function variableNameFromTextWithBraces(context: Context, text: string, createNewPartial = true) {
    const slicedText =text.slice(2, -2).trim();

    if (slicedText && createNewPartial && slicedText.includes(".")){
        const partialVariable = createPartialFromTemplateString(context, slicedText);
        return partialVariable.name;
    }

    return slicedText;
}