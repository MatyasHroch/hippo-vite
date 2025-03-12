import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import string from "vite-plugin-string";
import {ViteRuntimeImportMeta} from "vite/dist/node/runtime";
import {derenderIfNode, renderIfNode} from "../template/template_if_nodes";

// this function actually sets the variable's value
export function _setVariableValue<T>(context: Context, variable: Variable<T>, value: T){
    variable.previousValue = variable.value;
    variable.value = value;
}

export function setVariable<T>(context: Context, variable: Variable<T>, value: T){
    // here we set the variable value
    const isNotObject = !Object.keys(value);
    if (isNotObject && value === variable.value){
        return
    }
    _setVariableValue(context, variable, value);

    // here it just triggers all the watchers
    for (const watcher of variable.watchers) {
        watcher(context, variable, value);
    }

    return variable;
}

export function rerenderTextNodes<T>(context: Context, variable: Variable<T>, value: T){
    for (const node of variable.textNodes) {
        // changing just the text content
        node.textContent = variable.value as string;
    }
    return variable;
}

export function rerenderAttributes<T>(context: Context, variable: Variable<T>, value: T){
    for (const attributeNode of variable.attributes) {
        renderAttribute(attributeNode, value)
    }
    return variable;
}

export function renderAttribute(attributeNode: {node: Element, attribute: Attr}, value: any){
    // we set the attribute to the value
    attributeNode.attribute.value = value as string;

    // if it is a bolean attribute, we add it or remove it from the
    if (isBooleanAttribute(attributeNode.attribute)) {
        if (value){
            attributeNode.node.attributes.setNamedItem(attributeNode.attribute)
        } else {
            attributeNode.node.removeAttribute(attributeNode.attribute.name)
        }
    }
}

export function rerenderDependencies<T>(context: Context, variable: Variable<T>, value: T){
    // TODO - rerender the Dependencies
    console.log("// TODO - rerender the Dependencies")
    return variable;
}

export async function rerenderIfNodes<T>(context: Context, variable: Variable<T>, value: T){
    if (value){
        for (const ifNode of variable.ifNodes){
            await renderIfNode(ifNode)
        }
    }
    else {
        for (const ifNode of variable.ifNodes){
            derenderIfNode(ifNode)
        }
    }
}

export function rerenderPartials<T>(context: Context, variable: Variable<T>, value: T){
    for (const partialName in variable.partialVariables){
        const partialVariable = variable.partialVariables[partialName];

        let currentValue = value;
        for (const key of partialName.split(".")) {
            // if I get to some point where the key does not exist, the objectPath is invalid
            if (currentValue[key] === undefined) new Error(`Invalid path in partial variable: ${partialName}`);
            currentValue = currentValue[key];
        }
        partialVariable.set(currentValue);
    }
    return variable;
}

const booleanAttributes = new Set([
    "checked", "disabled", "readonly", "required", "open", "selected", "autofocus",
    "autoplay", "controls", "loop", "muted", "multiple", "novalidate", "reversed",
    "ismap", "defer", "hidden", "playsinline", "async", "default", "inert",
    "nomodule", "formnovalidate", "allowfullscreen", "itemscope", "sortable"
]);

export function isBooleanAttribute(attr: Attr): boolean {
    return booleanAttributes.has(attr.name);
}
