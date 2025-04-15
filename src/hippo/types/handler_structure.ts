type HandlerStructure = {
  handler: Function,
  stopEvent: boolean,
  handlerName?: string,
}

// the string here is name of the handler function
type HandlersStructure = Record<string, HandlerStructure>

// the string here is name of the event
type EventHandlersStructure = Record<string, HandlerStructure>