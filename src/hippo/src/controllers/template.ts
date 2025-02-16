import {Keywords} from "../../enums/keywords";
import {Context} from "../../types";

// we get the key words without the ":" separator
const bindKey = Keywords.bind;
const modelKey = Keywords.model;


export function stringToHtml(htmlString: string){
    const div = document.createElement("div")
    div.innerHTML = htmlString;

    return div.firstElementChild;
}

// TODO - complete and use this
export function bindAndModelAttributes (template: Element, context: Context) {
    // Finds all elements with attributes starting with "bind:" or "model:"
    const elementsWithBindings = template.querySelectorAll(`[${bindKey}\\:], [${modelKey}]\\:]`);

    for (const element of elementsWithBindings) {
        for (const attr of element.attributes) {
            if (attr.name.startsWith(`${bindKey}:`)) {
                console.log(`Element: ${element.tagName}, Binding: ${attr.name}, Value: ${attr.value}`);
                console.log(`Context: ${context}`);
                // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
                // and throw a warning
            }
            if (attr.name.startsWith(`${modelKey}:`)) {
                console.log(`Element: ${element.tagName}, Model: ${attr.name}, Value: ${attr.value}`);
                console.log(`Context: ${context}`);
                // TODO - bind and model the attribute to its Variable, if there is non, dont do anything
                // and throw a warning
            }
        }
    }

    return elementsWithBindings;
}

