// @ts-ignore
import template from "./testArticle.html";

import { Context } from "src/hippo";
import {emitEvent} from "../../../hippo/src/controllers/event";

export function testArticle(context: Context) {
  context.setTemplate(template);
  context.addHandlers({
    testArticleClicked: () => {
      context.emitEvent("testArticleClicked");
    }
  })

  // TODO - the parent properties should be processed first or we can define the properties here so then we can set it...
  // but i would prefer to have them here, so we can have the same behavior as with the variables
}
