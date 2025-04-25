import template from "./firstPage.html?raw"
import {Context} from "../../../../hippo";

export function firstPage(context: Context){
    context.setTemplate(template)

    // create variables that we display and let interact with the user
    context.addVariable(
        "paragraph",
        "This paragraph is dedicated to those who are open to new frameworks."
    );
    context.addVariable("testInputText", "...");
    context.addVariable("testInputNumber", 0);
    context.addVariable("disabledButton", true);
    context.addVariable("newHeading", "NEW HEADING");
}
