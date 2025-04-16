// @ts-ignore
import template from "./testArticle.html";

import { Context } from "src/hippo";
import {emitEvent} from "../../../hippo/src/controllers/event";

export function testArticle(context: Context) {
  context.setTemplate(template);
  context.addHandlers({
    testArticleClicked: () => {
      console.log("im in the article handler")
      context.emitEvent("testArticleClicked");
    }
  })
  console.log("This is the heading from the parent:")
  console.log(context.properties.heading)



  // TODO - the parent properties should be processed first or we can define the properties here so then we can set it...
  // but i would prefer to have them here, so we can have the same behavior as with the variables
}
