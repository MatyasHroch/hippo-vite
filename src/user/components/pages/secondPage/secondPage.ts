import template from "./secondPage.html?raw"
import {Context} from "../../../../hippo";
import {testArticle} from "../../test-article/testArticle";

export function secondPage(context: Context){
    context.setTemplate(template)

    const {newHeading, user} = context.addVariables({
        newHeading: "My New Heading",
        user: {
            firstName: "John",
            lastName: "Doe",
            address: {
                city: "Ostrava",
                postCode: 7090
            }
        }
    })

    context.addHandlers({
        toggleShowParagraph,
        clickedArticle : (index: number) => {
            alert(`article ${index} clicked`)
        }})

    const numbers = context.addVariable("numbers", [1, 2, 3]);

    context.addVariable("items", [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
    ]);


    // we save this variable to the constant to have access later
    const showParagraph = context.addVariable("showParagraph", false);

    //here we set the handler of the
    function toggleShowParagraph(){
        showParagraph.set(!showParagraph.value)
    }

    context.addChildren({
        testArticle
    })
}

