import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import string from "vite-plugin-string";
import {ViteRuntimeImportMeta} from "vite/dist/node/runtime";
import {derenderIfNode, renderIfNode} from "../template/template_if_nodes";
import {isForVariable} from "./variable_for";
import {isPrimitive} from "../../helpers/objects";
import {ForVariable} from "../../../types/for_variable";
import {ForStructure} from "../../../types/for_structure";
import {createForItemContext, createForItemTemplate, putBeforeElement} from "../template/template_for";
import {createPartialVariable} from "./variable_partials";

// this function actually sets the variable's value
export function _setVariableValue<T>(context: Context, variable: Variable<T>, value: T){
    variable.previousValue = variable.value;
    variable.value = value;
}

export async function setVariable<T>(context: Context, variable: Variable<T>, value: T){
    // here we set the variable value
    const isNotObject = !Object.keys(value);
    if (isNotObject && value === variable.value){
        return
    }

    if (isForVariable(variable)){
        // TODO - change the contexts and do some

    }

    _setVariableValue(context, variable, value);

    // here it just triggers all the watchers
    for (const watcher of variable.watchers) {
        await watcher(context, variable, value);
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
            if (currentValue[key] === undefined) {
                partialVariable.set(undefined);
                new Error(`Invalid path in partial variable: ${partialName}`);
            }
            currentValue = currentValue[key];
        }
        partialVariable.set(currentValue);
    }
    return variable;
}

export async function rerenderFor(context: Context, variable: ForVariable<any>, value: any){
    if (isPrimitive(value)) return variable

    const newData = value;
    const forStructures = variable.forStructures;
    const itemName = variable.itemName

    // TODO - reduce the forStructures by those items that has been deleted
    const newForStructures: Array<ForStructure<any>> = [];

    let placeholder = variable.placeHolder;

    let index = 0;
    for (const key in newData){
        const newForItem = newData[key];
        const itemStructureIndex = forStructures.findIndex(
            (forStructure: ForStructure<any>)=> newForItem === forStructure.context[itemName]
        );
        let newForStructure :ForStructure<any>;
        let forItemTemplate: Element;
        if (itemStructureIndex < 0){
            // here we need to create a whole new structure (context, template)

            // here we create the context
            const newForItemContext = createForItemContext(context, variable, key, variable.forNode, itemName, variable.indexName, variable.keyName, index)
            // and here the template
            forItemTemplate = await createForItemTemplate(context, placeholder, variable.nodesToSlot, false)

            // here we put the attributes together to the FofStructure
            newForStructure = {
                itemNode: forItemTemplate,
                context: newForItemContext,
                variable: context.variables[itemName]
            }
        }
        else {
            // we just need to put it to the
            // so the structure stays the same after some changes
            newForStructure = newForStructures[key]
        }

        newForStructures.push(newForStructure);

        index ++;
    }

    // TODO - now mount it by the right order
    for(const newStructure of newForStructures){
        debugger
        const forNode = newStructure.itemNode
        putBeforeElement(placeholder, forNode)
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
