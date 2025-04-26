import { Context } from "./context";

export type UserDefinedComponent = (context: Context) => any;

export type NewComponentStruct = {
  template?: Element;
  context?: Context;
  name: string;
};
