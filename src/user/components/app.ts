// @ts-ignore
import appTemplate from "./app.html";
import { Context } from "../../hippo";
import { myArticle } from "./my-article/myArticle";
import { list } from "./list/list";

export async function app(context: Context) {
  const { variables } = context;

  // if we want the template
  context.setTemplate(appTemplate);

  // if we want to set child components
  // TODO - load these so we could
  context.addChildren({
    MyArticle: myArticle,
    list,
  });

  // we add variables one by one like this:
  context.addVariable("name", "Felix");
  context.addVariable("age", 20);
  const badInputs = context.addVariable("badInputs", true);
  setTimeout(() => {
    console.log("Bad Inputs value is " + badInputs.value);
    badInputs.set(false);
    console.log("Now we have set it to false");
  }, 2 * 1000);

  setTimeout(() => {
    console.log("Bad Inputs value is " + badInputs.value);
    badInputs.set(true);
    console.log("Now we have set it to false");
  }, 5 * 1000);

  // we can access the variables via context
  console.log(
    "in my component.ts 2 which is ts the variables are: ",
    variables
  );
  console.log({ context });

  //
}
