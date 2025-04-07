// @ts-ignore
// we must get the template
import appTemplate from "./app.html";
import { Context } from "../../hippo";

export async function app(context: Context) {
  // we must set the template
  context.setTemplate(appTemplate);

  // create variables that we display and let interact with the user
  context.addVariable("paragraph", "This is a test paragraph.");
  context.addVariable("testInputText", "...");
  context.addVariable("testInputNumber", 0);

  // we save this variable to the constant to have access later
  const showVriable = context.addVariable("showParagraph", false);

  //here we set the handler of the 
  context.addHandler(() => showVriable.set(!showVriable.value), "onclick");
}
