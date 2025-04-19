import { Context } from "../../../hippo";
import template from "./list.html?raw";

export function list(context: Context) {
  context.setTemplate(template);
}
