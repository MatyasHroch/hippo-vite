
// TODO - complete and use this
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";
import {variablePattern} from "./constants";
// we get the keywords without the ":" separator
const bindKey = Keywords.bind;
const modelKey = Keywords.model;

export function isAttributeToBind(attribute : Attr){
    return attribute.value.startsWith("{{") && attribute.value.endsWith("}}");
}

export function attributeNameToVariableName(attribute : Attr){

    // later we will parse the variables identifier and so on
    // TODO - here we will bind the new created Partial as well
    const match = attribute.value.trim().match(variablePattern);
    return match ? match[1] : null;
}

export function isAttributeToModel(attribute : Attr){
    return attribute.name.startsWith(`${modelKey}:`);
}

export function bindAttribute(context: Context, attribute: Attr, node: Node) {
    // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
    console.log("todo - Bind variable to this attribute", attribute);
    const {variables} = context;
    const variableName = attributeNameToVariableName(attribute);
    // TODO - should i ošetřit this?
    const variable = variables[variableName];
    if (!variable) return;

    variable.attributes.push({node, attribute});
    // TODO - use the set function here as well maybe
    // TODO - handle bolean attributes somehow
    attribute.value = variable.value as string;

    return true;
}

// TODO - complete and use this
export function modelAttribute (context: Context, attribute: Attr) {
    // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
    console.log("todo - Model variable to this attribute", attribute);
    return true;
}
