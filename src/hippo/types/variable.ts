import {Context} from "./context";
import {Handler} from "./handler";
import {ForLoopStructure, ForItemStructure} from "./for_structure";

export type IfNodeStructure = {
  placeholderNode: Element,
  templateNode: Element,
  context: Context,
  nodesToSlot: Array<Element>,
  renderedTemplateNode?: Element,
  // renderIf?: Function,
  // derenderIf?: Function,
}

export type Variable<T> = {
  // identifiers
  name: string;
  fullName: string;
  contextId: number;
  context: Context;

  // TODO does it make sense?
  // context: Context

  // values
  value: T;
  previousValue: T | undefined;

  // TODO - create addWatcher method, and the typing should be better
  watchers: Array<Handler>; // functions that activates when the variable is changed

  inputNodes: Array<HTMLInputElement>; // two-way binding - input, select and textarea
  textNodes: Array<Text>; // one-way binding - variables rendered as a string
  attributes: Array<{node: Element, attribute: Attr}>; // one-way binding - variables as attributes
  forStructuresArray: Array<ForLoopStructure<T>> // structures for creating and operating with for iterations and elements

  ifNodes: Array<IfNodeStructure> // nodes that will be removed if the variable is not truly
  showNodes: Array<HTMLElement>; // nodes that will be given display none if the value is not truly

  // only when it has a partial variable
  pathFromOrigin: string | null;
  originVariable: Variable<any> |null;

  // only when it has a partial variables
  partialVariables: Record<string, Variable<any>>;

  // TODO - better typing
  set: Function;

  updating: boolean;
};

