// @ts-ignore
import template from "./myArticle.html"
import {Context} from "../../../hippo";
import {list} from "../list/list";

export function myArticle(context:Context){
    context.addVariable("heading", "My Awesome Heading");
    context.addVariable("paragraph", "My Paragraph content");

    context.addChildren({
      list,
    })

    context.setTemplate(template)
}
