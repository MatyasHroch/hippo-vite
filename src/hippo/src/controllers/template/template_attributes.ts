
// TODO - complete and use this
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";
import {attributeBindPattern, attributeModelPattern} from "./constants";
import {renderAttribute} from "../variable/variable_set";
import {createPartialFromTemplateString} from "../variable/variable_partials";

// 1) registers the attribute to the variable
// 2) calls renderAttribute
export function bindAttribute(context: Context, attribute: Attr, node: Element, variableNameExtractor: Function = variableNameFromAttributeToBind) {
    // TODO - bind the attribute to its Variable, if there is non, dont do anything
    const {variables} = context;

    const variableName = variableNameExtractor(context, attribute);

    // TODO - should i ošetřit this?
    const variable = variables[variableName];
    if (!variable) return;

    const attributeNode = {node, attribute};
    variable.attributes.push(attributeNode);

    // TODO - handle bolean attributes somehow - DONE, but not added to the attributeNodes as attr and the node
    renderAttribute(attributeNode, variable.value);
    return variable;
}

// 1) calls the bindAttribute function
// 2) adds "input" event listener to change variable value from the user input
export function modelAttribute (context: Context, attribute: Attr, node: Element )
{
    const variable = bindAttribute(context, attribute, node, variableNameFromAttributeToModel)
    if (!variable) return;
    node.addEventListener("input", (event: Event) =>{
        const value = event.target[attribute.name];
        variable.set(value);
        console.log("Variable: " + variable.name + " is: " + variable.value)
    })
    return variable;
}

export function isAttributeToBind(attribute : Attr){
    const match = attribute.value.trim().match(attributeBindPattern);
    return match ? match[1] : null;
}

export function isAttributeToModel(attribute : Attr){
    const match = attribute.value.trim().match(attributeModelPattern);
    return match ? match[1] : null;
}

export function variableNameFromAttributeToBind(context: Context, attribute : Attr, createNewPartial = true){
    // later we will parse the variables identifier and so on
    // TODO - here we will bind the new created Partial as well
    const match = attribute.value.trim().match(attributeBindPattern);
    const theMatch = match ? match[1] : null;
    debugger

    if (createNewPartial && theMatch && theMatch.includes(".")){
        createPartialFromTemplateString(context, theMatch);
    }
    return theMatch
}

export function variableNameFromAttributeToModel(context: Context, attribute : Attr, createNewPartial = true){
    // later we will parse the variables identifier and so on
    // TODO - here we will bind the new created Partial as well
    const match = attribute.value.trim().match(attributeModelPattern);
    const theMatch = match ? match[1] : null;

    debugger

    if (theMatch && createNewPartial && theMatch.includes(".")){
        createPartialFromTemplateString(context, match[1]);
    }
    return theMatch
}
