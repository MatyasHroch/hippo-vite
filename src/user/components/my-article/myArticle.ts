// @ts-ignore
import template from "./myArticle.html"
import {Context} from "../../../hippo";
import {list} from "../list/list";

export function myArticle(context:Context){
    // SETTING UP VARIABLES
    const heading = context.addVariable("heading", "My Heading");
    const paragraph = context.addVariable("paragraph", "My Paragraph content");
    const isCheckBoxEnabled = context.addVariable("isCheckBoxEnabled", true);
    const isButtonDisabled = context.addVariable("isButtonDisabled", !isCheckBoxEnabled.value);
    const newParagraph = context.addVariable("newParagraph", "");

    const userWithPartial = context.addVariable("user", {
        name: "Albert",
        surname: "Einstein",
        address: {
            city: "Ostrava",
            postCode: 70900
        }
    })
    
    // WATCHERS - will be better
    newParagraph.watchers.push((c,v ,value) => {
        checkButton()
        return v;
    });
    isCheckBoxEnabled.watchers.push((c,v,value) => {
        checkButton()
        return v;
    })

    setTimeout(() =>{
        heading.set("Changed-Heading");

        const myUser = userWithPartial.value;
        myUser.address.city = "Olomouc";

        userWithPartial.set(myUser);
    }, 2 * 1000)

    function checkButton(){
        const isOk = newParagraph.value.length > 10 && isCheckBoxEnabled.value;
        if (isButtonDisabled.value !== isOk) return;
        isButtonDisabled.set(!isOk);
    }
    checkButton()

    // FOR THE TEMPLATE TO WORK
    context.addChildren({
      list,
    })
    context.setTemplate(template)
}
