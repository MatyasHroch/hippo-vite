import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import string from "vite-plugin-string";
import {ViteRuntimeImportMeta} from "vite/dist/node/runtime";

// this function actually sets the value
export function _setVariableValue<T>(context: Context, variable: Variable<T>, value: T){
    variable.previousValue = variable.value;
    variable.value = value;
}

export function setVariable<T>(context: Context, variable: Variable<T>, value: T){
    // here we set the variable value
    if (value === variable.value){
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
    // TODO - handle bolean attributes somehow
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

export function rerenderDependencies<T>(variable: Variable<T>){
    // TODO - rerender the Dependencies
    console.log("// TODO - rerender the Dependencies")
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
