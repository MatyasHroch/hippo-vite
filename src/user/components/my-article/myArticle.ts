// @ts-ignore
import template from "./myArticle.html"
import {Context} from "../../../hippo";
import {list} from "../list/list";

export function myArticle(context:Context){
    const heading = context.addVariable("heading", "My Awesome Heading");
    context.addVariable("paragraph", "My Paragraph content");

    context.addChildren({
      list,
    })

    setTimeout(() => {
        heading.set("New Awesome Heading");
    }, 5* 1000)

    context.setTemplate(template)
}
