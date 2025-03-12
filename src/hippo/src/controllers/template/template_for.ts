import {Keywords} from "../../../enums/keywords";
import {Context} from "../../../types";
import {getVariableFromTemplateString} from "./template_attributes";

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
    // TODO - get from all lists variables, properties, computed and so on
    // TODO - get the partial variable as well if the variable is not right away
    const variable = getVariableFromTemplateString(context, dataName)

}