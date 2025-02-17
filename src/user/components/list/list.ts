import {Context} from "../../../hippo";
// @ts-ignore
import template from "./list.html";

export function list(context: Context){
    context.setTemplate(template);
}