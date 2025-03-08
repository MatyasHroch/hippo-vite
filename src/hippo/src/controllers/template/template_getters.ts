import {Context} from "../../../types";
import {bindAttribute, isAttributeToBind, isAttributeToModel, modelAttribute} from "./template_attributes";
import {Component} from "../../../types/component";
import {bindTextNode} from "./template_text_nodes";
import {createPartialFromTemplateString} from "../variable/variable_partials";
import {Keywords} from "../../../enums/keywords";
import {derenderIfNode, getIfPlaceholderTag, renderIfNode} from "./template_if_nodes";
import {cloneElement} from "./template_main";

type ChildrenArray = Array<{
    tag: Element,
    component: Component,
    nodesToSLot? : Array<Element>,
    slot? : Element,
    name? : string
}>;

export async function processNodes(node: Element, context: Context, nodesToSlot: Array<Element> = null) {
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
        // TODO - nest this to some function please
        // TODO - here implement some syntactic sugar for the library users
        const variableName = ifAttribute.value.trim()
        const variable = context.variables[variableName]
        if (!variable) Error("Variable with name " + variableName + " has not found");

        const ifNode = {
            placeholderNode: getIfPlaceholderTag(),
            templateNode: node,
            context: context,
            nodesToSlot: nodesToSlot,
            renderedTemplateNode: node,
        }

        variable.ifNodes.push(ifNode)

        derenderIfNode(ifNode)

        if (variable.value){
            await renderIfNode(ifNode)
        }

        return {
            textNodes,
            attributeNodes,
            childComponents
        };
        // // put a placeholder after the node, then remove the node
        // const ifNodeStructure :IfNodeStructure = {
        //     placeholderNode: getIfPlaceholderTag(),
        // }

        // const derenderIf = generateDerenderIf(context, ifNodeStructure, node, ifNodeStructure.placeholderNode)
        // const renderIf = generateRenderIf(context, ifNodeStructure, node, ifNodeStructure.placeholderNode, nodesToSlot)

        // await derenderIf();


        // // when the variable is truly, we
        // if (variable.value){
        //     console.log("Here we have a truly if node")
        //     await renderIf()
        // }
        // else {
        //     await derenderIf();
        //     console.log("Here we have a falsy if node")
        // }

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
            nodesToSLot: [...node.children]
        });

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