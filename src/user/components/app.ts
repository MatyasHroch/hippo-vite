// @ts-ignore
// we must get the template
import appTemplate from "./app.html";
import { Context } from "../../hippo";
import { testArticle } from "./test-article/testArticle";
import { list } from "./list/list";

export async function app(context: Context) {
  // we must set the template
  context.setTemplate(appTemplate);

  const page = context.addVariable("page", 0)

  context.addComputed(() => {
    return page.value === 0
  }, "firstPage")
  context.addComputed(() => {
    return page.value === 1
  }, "secondPage")

  // create variables that we display and let interact with the user
  context.addVariable("paragraph", "This paragraph is dedicated to those who are open to new frameworks.");
  context.addVariable("testInputText", "...");
  context.addVariable("testInputNumber", 0);
  context.addVariable("disabledButton", false);
  const numbers = context.addVariable("numbers", [1,2,3]);

  context.addVariable("items", [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ]);

  // we save this variable to the constant to have access later
  const showVariable = context.addVariable("showParagraph", true);

  //here we set the handler of the
  context.addHandler(() => showVariable.set(!showVariable.value), "onclick");

  // to have the children components rendered we need to add them to the context
  context.addChildren({ testArticle, list });

  context.addVariable("childheading", "Heading from parent");

  setTimeout(() => {
    console.log(numbers.value);
    numbers.set([1,2])
    console.log(numbers.value);

      }, 2 * 1000
  )

  // setInterval(() => {
  //   const allIfNodes = []
  //   for (const variableName in context.variables){
  //     allIfNodes.push(...context.variables[variableName].ifNodes);
  //   }
  //
  //   page.set((page.value + 1) % 2);
  //   console.log(...allIfNodes);
  // }, 1000 * 4, )
}
