import template from "./testArticle.html?raw";
import { Context } from "src/hippo";

export function testArticle(context: Context) {
  context.setTemplate(template);
  context.addHandlers({
    testArticleClicked: () => {
      context.emitEvent("testArticleClicked");
    }
  })

  // we check if we got the heading, if not, we create a variable instead
  const heading = context.properties.heading ?? context.addVariable("heading", "Default Heading");

  // TODO - the parent properties should be processed first or we can define the properties here so then we can set it...
  // but i would prefer to have them here, so we can have the same behavior as with the variables
}
