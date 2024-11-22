export type Context = {
  // values
  id: number,
  variables: Record<string, any>;
  parent: Context | null;

  // template
  template?: Element;
  templateString?: string;

  // methods
  addVariable: Function;
  addWatcher: Function;
  setTemplate: Function;
};
