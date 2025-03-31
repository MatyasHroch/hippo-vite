type HandlerStructure = {
  handler: Function;
  stopEvent: boolean;
};

type HandlerStructures = Record<string, HandlerStructure>;
