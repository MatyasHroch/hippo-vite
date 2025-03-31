import { Context } from "src/hippo/types";

export function emitEvent(context: Context, eventName: string, [...args]) {
  let currentContext = context.parent;
  while (currentContext) {
    const handlerStructure = currentContext.handlers[eventName];
    if (handlerStructure) handlerStructure.handler(...args);

    if (handlerStructure.stopEvent) break;

    currentContext = currentContext.parent;
  }
}
