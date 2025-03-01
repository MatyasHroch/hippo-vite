import {Context} from "./context";
import {Variable} from "./variable";

export type VariableNameExtractor = <T>(context: Context, attribute : Attr) => Variable<T>;