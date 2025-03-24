import {Context} from "./context";

export type UserDefinedComponent = Function;

export type NewComponentStruct = {
    template?: Element;
    context?: Context;
    name: string;
}