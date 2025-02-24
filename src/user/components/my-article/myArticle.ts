// @ts-ignore
import template from "./myArticle.html"
import {Context} from "../../../hippo";
import {list} from "../list/list";

export function myArticle(context:Context){
    const heading = context.addVariable("heading", "My Heading");
    const paragraph = context.addVariable("paragraph", "My Paragraph content");
    const isCheckBoxEnabled = context.addVariable("isCheckBoxEnabled", true);
    const isButtonDisabled = context.addVariable("isButtonDisabled", !isCheckBoxEnabled.value);

    const newParagraph = context.addVariable("newParagraph", "");

    newParagraph.watchers.push((c,v ,value) => {
        checkButton()
        return v;
    });

    isCheckBoxEnabled.watchers.push((c,v,value) => {
        checkButton()
        return v;
    })

    function checkButton(){
        const isOk = newParagraph.value.length > 10 && isCheckBoxEnabled.value;
        isButtonDisabled.set(!isOk);
    }
    checkButton()


    context.addChildren({
      list,
    })

    context.setTemplate(template)
}
