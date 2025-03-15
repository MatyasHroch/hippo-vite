import {Keywords} from "../../../enums/keywords";
import {Context} from "../../../types";
import {getVariableFromTemplateString} from "./template_attributes";
import {cloneContext} from "../context";
import {cloneElement} from "./template_main";
import {processTemplate} from "../component";
import {getIfPlaceholderTag} from "./template_if_nodes";
import {createOriginVariable} from "../variable/variable_main";
import {createPartialVariable} from "../variable/variable_partials";
import {isForVariable} from "../variable/variable_for";
import {ForStructure} from "../../../types/for_structure";

export async function processFor(context:Context, node: Element, nodesToSlot: Array<Element>) {
    // if (!node.hasAttribute(Keywords.for)) return;
    const forString = node.getAttribute(Keywords.for);
    const splitForString = forString.split(Keywords.in)
    if (splitForString.length < 2) return;

    let [variablePart, dataName] = splitForString;

    const splitVariablePart = variablePart.split(",")
    const itemName = splitVariablePart.length > 0 ? splitVariablePart[0].trim() : null;
    const indexName = splitVariablePart.length > 1 ? splitVariablePart[1].trim() : null;
    const keyName = splitVariablePart.length > 2 ? splitVariablePart[2].trim() : null;

    dataName = dataName.trim()

    if (!itemName) return null;

    const forStructures: Array<ForStructure<any>> = [];
    const contexts:Array<Context> = [];

    // TODO - get from all lists variables, properties, computed and so on
    // TODO - get the partial variable as well if the variable is not right away
    // TODO - better code here
    const variableToIterate = getVariableFromTemplateString(context, dataName)

    // if (!variableToIterate) return null;
    const dataToIterate = variableToIterate.value

    // TODO - index needs to be recalculated after some operations with the array
    let index = 0;
    // creating the context with the template
    for (const itemKey in dataToIterate) {
        const value = dataToIterate[itemKey];
        const itemContext = cloneContext(context);

        // to have the iteration value in the for loop
        itemContext.variables[itemName] = createPartialVariable(variableToIterate, variableToIterate.name + ".value." + itemKey)

        // to have the template inside the context and without the for attribute
        node.removeAttribute(Keywords.for);
        itemContext.template = cloneElement(node)

        // to have the index in the for loop
        if (indexName){
            // TODO - create not origin, but COMPUTED variable, the index will rerender everytime the iterable data are changed
            itemContext.variables[indexName] = createOriginVariable(indexName, index)
        }

        // to have the key in the for loop
        if (keyName){
            // TODO - create not origin, but COMPUTED variable, the index will rerender everytime the iterable data are changed
            itemContext.variables[keyName] = createOriginVariable(keyName, itemKey)
        }

        // just for the first render, we generate the index like this
        index++;
        // we stack the contexts so
        contexts.push(itemContext);
    }

    // rendering and mounting
    putBeforeElement(node, getIfPlaceholderTag())
    for (const context of contexts){
        const newComponent = {
            name: "fake-for-component-"+ context.id,
            context,
            template: context.template,
        }
        const {template} = await processTemplate(newComponent,
            node,
            nodesToSlot,
            putBeforeElement
        )
        forStructures.push({
            context: context,
            itemNode: template,
            variable: context.variables[itemName],
        })
    }

    if (!isForVariable(variableToIterate)) return new Error("For Variable not created properly");
    variableToIterate.nodesToSlot = nodesToSlot
    variableToIterate.forStructures = forStructures;
    variableToIterate.forNode = node;
    variableToIterate.itemName = itemName;

    // to get rid of the original node
    node.remove()
}

function putBeforeElement(element: Element, renderedTemplate:Element) {
    const parent = element.parentNode
    if (!parent) return
    return parent.insertBefore(renderedTemplate, element)
}