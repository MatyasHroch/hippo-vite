import {Context} from "../../../types";
import {findVariables, variableFromTextWithBraces} from "./template_getters";
import {Variable} from "../../../types/variable";
import {textNodePattern} from "./constants";

export function bindTextNode(context:Context, node: Node){
    const foundVariables = findVariables(node);

    if (foundVariables) {
        const nodeText = node.nodeValue;
        const splitText = splitNodeText(nodeText);
        const parent = node.parentNode;
        parent.removeChild(node);
        composeTextNodes(context, splitText, context.variables, parent);
    }
}

function renderTextNode(context:Context, nodeText: string, variables :Record<string, Variable<any>>) {
    if (nodeText.startsWith("{{") && nodeText.endsWith("}}")) {
        const variable = variableFromTextWithBraces(context, nodeText);

        if (!variable) {
            console.error(`Variable ${variable.name} not found.`);
            return document.createTextNode("");
        }

        const value = variable.value;
        const element = document.createTextNode(value);
        variable.textNodes.push(element);

        return element;
    }

    return document.createTextNode(nodeText);
}

function composeTextNodes(context:Context, splitText: Array<string>, variables: Record<string, Variable<any>>, parent: Node) {
    for (const text of splitText) {
        const textNode = renderTextNode(context, text, variables);
        parent.appendChild(textNode);
    }
    return parent;
}

function splitNodeText(nodeText :string) {
    // Split the text using the pattern
    const textParts = nodeText.split(textNodePattern);
    return textParts.filter((textPart) => textPart !== "");
}