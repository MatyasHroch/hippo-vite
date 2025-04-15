import { Context } from "src/hippo/types";
import {isFakeForContext} from "./context";

export function emitEvent(
  context: Context,
  eventName: string,
  ...args: unknown[]
) {
  let currentContext = context.parent;
  while (currentContext) {
    const handlerStructure = currentContext.eventHandlers[eventName] ?? currentContext.eventHandlers[eventName.toLowerCase()]

    if (handlerStructure) {
      handlerStructure.handler(...args);
      if (handlerStructure.stopEvent) break;
    }

    if (isFakeForContext(currentContext) && currentContext.parent) {
      currentContext = currentContext.parent.parent;
      continue
    }

    currentContext = currentContext.parent;
  }
}
