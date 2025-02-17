import {Context} from "../../../hippo";

export function list(context: Context){
    // @ts-ignore
    context.setTemplate(import("./list.html"))
}