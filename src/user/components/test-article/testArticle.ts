// @ts-ignore
import template from "./testArticle.html";

import { Context } from "src/hippo";

export function testArticle(context: Context) {
  context.setTemplate(template);

  // TODO - the parent properties should be processed first or we can define the properties here so then we can set it...
  // but i would prefer to have them here, so we can have the same behavior as with the variables
}
