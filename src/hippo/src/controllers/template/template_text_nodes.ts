
// TODO - complete and use this
import {Context} from "../../../types";
import {findVariables, variableNameFromCurlyBraces} from "./template_getters";
import {Variable} from "../../../types/variable";
import {textNodePattern} from "./constants";

export function bindTextNode(context:Context, node: Node){
    const foundVariables = findVariables(node);

    // TODO - add a function that would create a partial variable if it is possible

    if (foundVariables) {
        const nodeText = node.nodeValue;
        const splitText = splitNodeText(nodeText);
        const parent = node.parentNode;
        parent.removeChild(node);

        composeTextNodes(splitText, context.variables, parent);
    }
}

function renderTextNode(nodeText: string, variables :Record<string, Variable<any>>) {
    if (nodeText.startsWith("{{") && nodeText.endsWith("}}")) {
        const variableName = variableNameFromCurlyBraces(nodeText);
        const variable = variables[variableName];

        if (!variable) {
            const varAndKeys = variableName.split(".");
            if (varAndKeys.length >= 1) {
                // TODO - create Partial and then bind it
                // const composedVariable = variables[varAndKeys[0]];
                // let keys = varAndKeys.slice(1);
                // const expression = () => {
                //     return getValueByKeyPath(composedVariable, keys);
                // };
                // const value = expression();
                // if (value !== undefined && value !== null) {
                //     const element = document.createTextNode(value);
                //     composedVariable.textNodesWithExpression.push({
                //         node: element,
                //         expression: expression,
                //     });
                //
                //     return element;
                // }
            }
            console.error(`Variable ${variableName} not found.`);
            return document.createTextNode("");
        }

        const value = variable.value;
        const element = document.createTextNode(value);
        variable.textNodes.push(element);

        return element;
    }

    return document.createTextNode(nodeText);
}

function composeTextNodes(splitText: Array<string>, variables: Record<string, Variable<any>>, parent: Node) {
    for (const text of splitText) {
        // TODO here add the creation of a Partial Variable
        const textNode = renderTextNode(text, variables);
        parent.appendChild(textNode);
    }
    return parent;
}

function splitNodeText(nodeText :string) {
    // Split the text using the pattern
    const textParts = nodeText.split(textNodePattern);
    return textParts.filter((textPart) => textPart !== "");
}