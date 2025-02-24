
// TODO - complete and use this
import {Context} from "../../../types";
import {findVariables, variableNameFromCurlyBraces} from "./template_getters";
import {Variable} from "../../../types/variable";
import {variablePattern} from "./constants";

export function bindTextNode(context:Context, node: Node){
    const foundVariables = findVariables(node);

    if (foundVariables) {
        const nodeText = node.nodeValue;
        const splitText = splitNodeText(nodeText);
        const parent = node.parentNode;
        parent.removeChild(node);

        debugger
        composeTextNodes(splitText, context.variables, parent);
    }
}

function renderVariable(nodeText: string, variables :Record<string, Variable<any>>) {
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
        const textNode = renderVariable(text, variables);
        parent.appendChild(textNode);
    }
    return parent;
}

function splitNodeText(nodeText :string) {
    // Split the text using the pattern
    const textParts = nodeText.split(variablePattern);

    return textParts.filter((textPart) => textPart !== "");
}