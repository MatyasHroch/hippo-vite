import {Keywords} from "../../../enums/keywords";
import {Context} from "../../../types";
import {getVariableFromTemplateString} from "./template_attributes";
import {cloneContext} from "../context";
import {cloneElement} from "./template_main";
import {processTemplate} from "../component";

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

    // TODO - get from all lists variables, properties, computed and so on
    // TODO - get the partial variable as well if the variable is not right away
    const variableToIterate = getVariableFromTemplateString(context, dataName)

    // if (!variableToIterate) return null;
    const dataToIterate = variableToIterate.value

    const contexts = [];

    // TODO - index needs to be recalculated after some operations with the array
    let index = 0;
    // creating the context with the template
    for (const itemKey in dataToIterate) {
        const value = dataToIterate[itemKey];
        const itemContext = cloneContext(context);

        // to have the iteration value in the for loop
        itemContext.addVariable(itemName, value)

        // to have the template inside of the context
        node.removeAttribute(Keywords.for);
        itemContext.template = cloneElement(node)

        // to have the index in the for loop
        if (indexName){
            itemContext.addVariable(indexName, index)
        }

        // to have the key in the for loop
        if (keyName){
            itemContext.addVariable(keyName, itemKey)
        }

        // just for the first render, we generate the index like this
        index++;

        contexts.push(itemContext);
    }

    // rendering and mounting

    for (const context of contexts){
        const newComponent = {
            name: "fake-for-component",
            context,
            template: context.template,
        }
        debugger
        await processTemplate(newComponent, node, nodesToSlot)
    }
}