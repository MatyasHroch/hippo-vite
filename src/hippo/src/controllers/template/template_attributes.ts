
// TODO - complete and use this
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";
import {attributeBindPattern, attributeModelPattern} from "./constants";
import {renderAttribute} from "../variable/variable_set";
// we get the keywords without the ":" separator
const modelKey = Keywords.model;

export function isAttributeToBind(attribute : Attr){
    return attribute.value.startsWith("{{") && attribute.value.endsWith("}}");
}

export function attributeToBindToVariableName(attribute : Attr){
    // later we will parse the variables identifier and so on
    // TODO - here we will bind the new created Partial as well
    const match = attribute.value.trim().match(attributeBindPattern);
    return match ? match[1] : null;
}

export function attributeToModelToVariableName(attribute : Attr){
    // later we will parse the variables identifier and so on
    // TODO - here we will bind the new created Partial as well
    return attribute.value.slice(2, -2).trim();
}

export function isAttributeToModel(attribute : Attr){
    return attribute.value.startsWith("[[") && attribute.value.endsWith("]]");
}

export function bindAttribute(context: Context, attribute: Attr, node: Element, variableNameExtractor: Function = attributeToBindToVariableName) {
    // TODO - bind the attribute to its Variable, if there is non, dont do anything
    const {variables} = context;
    const variableName = variableNameExtractor(attribute);
    // TODO - should i ošetřit this?
    const variable = variables[variableName];
    if (!variable) return;

    const attributeNode = {node, attribute};
    variable.attributes.push(attributeNode);
    // TODO - handle bolean attributes somehow - DONE
    // attribute.value = variable.value as string;

    renderAttribute(attributeNode, variable.value);

    return variable;
}

// TODO - complete and use this
export function modelAttribute (context: Context, attribute: Attr, node: Element ) {
    const variable = bindAttribute(context, attribute, node, attributeToModelToVariableName)

    if (!variable) return;
    node.addEventListener("input", (event: Event) =>{

        const value = event.target[attribute.name];
        variable.set(value);
        console.log("Variable: " + variable.name + " is: " + variable.value)
    })
    return variable;
}
