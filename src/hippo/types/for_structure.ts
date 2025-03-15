import {Context} from "./context";
import {Variable} from "./variable";

export type ForStructure<T> = {
    context: Context;
    itemNode: Element;
    variable: Variable<T>;
}