
// TODO - complete and use this
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";
// we get the keywords without the ":" separator
const bindKey = Keywords.bind;
const modelKey = Keywords.model;

export function isAttributeToBind(attribute : Attr){
    return attribute.name.startsWith(`${bindKey}:`);
}

export function isAttributeToModel(attribute : Attr){
    return attribute.name.startsWith(`${modelKey}:`);
}

export function bindAttribute (context: Context, attribute: Attr) {
    // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
    return true;
}

// TODO - complete and use this
export function modelAttribute (context: Context, attribute: Attr) {
    // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
    return true;
}
