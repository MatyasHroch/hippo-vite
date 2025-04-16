import { Context } from "src/hippo/types";
import {isFakeForContext} from "./context";

export function emitEvent(
  context: Context,
  eventName: string,
  ...args: unknown[]
) {
  let currentContext = context;
  let childSubscribers = currentContext.subscribers;

  currentContext = context.parent;
  while (currentContext) {

    const handlerStructure = currentContext.eventHandlers[eventName] ?? currentContext.eventHandlers[eventName.toLowerCase()]

    const eventSubscribers = childSubscribers[eventName] ?? childSubscribers[eventName.toLowerCase()];
    if (handlerStructure && eventSubscribers) {

      for (const subscriber of eventSubscribers) {
        if(subscriber == currentContext){
          handlerStructure.handler(...args);
        }
      }
      if (handlerStructure.stopEvent) break;
    }

    // if the context is just fake for component, we skip the unused parent context
    if (isFakeForContext(currentContext) && currentContext.parent) {
      currentContext = currentContext.parent.parent;
      continue
    }

    childSubscribers = currentContext.subscribers;
    currentContext = currentContext.parent;

  }
}
