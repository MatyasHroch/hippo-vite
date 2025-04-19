// we must get the template
import appTemplate from "./app.html?raw"

import { Context } from "../../hippo";
import { testArticle } from "./test-article/testArticle";
import { list } from "./list/list";

export async function app(context: Context) {
  // we must set the template
  context.setTemplate(appTemplate);

  // create variables that we display and let interact with the user
  context.addVariable(
    "paragraph",
    "This paragraph is dedicated to those who are open to new frameworks."
  );
  context.addVariable("testInputText", "...");
  context.addVariable("testInputNumber", 0);
  context.addVariable("disabledButton", true);
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

  context.addHandlers({toggleShowParagraph, clickedArticle : (index: number) => {
    alert(`article ${index} clicked`)
    }})

  // to have the children components rendered we need to add them to the context
  context.addChildren({ testArticle, list });

  context.addVariable("childheading", "Heading from parent");

  setTimeout(() => {
    numbers.set([1, 2]);
  }, 2 * 1000);
}
