// @ts-ignore
import template from "./myArticle.html"
import {Context} from "../../../hippo";
import {list} from "../list/list";

export function myArticle(context:Context){
    const heading = context.addVariable("heading", "My Heading");
    const paragraph = context.addVariable("paragraph", "My Paragraph content");

    context.addChildren({
      list,
    })

    context.setTemplate(template)
}
