import { Context } from "src/hippo/types";

export function emitEvent(
  context: Context,
  eventName: string,
  ...args: unknown[]
) {
  let currentContext = context.parent;
  while (currentContext) {
    const handlerStructure = currentContext.handlers[eventName];
    console.log("Arguments in emitEvent = " + args);
    if (handlerStructure) {
      handlerStructure.handler(...args);
      if (
        handlerStructure.stopEvent !== undefined &&
        handlerStructure.stopEvent
      )
        break;
    }

    currentContext = currentContext.parent;
  }
}
