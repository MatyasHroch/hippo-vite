import {Context} from "./context";
import {Variable} from "./variable";

export type Variable_name_extractor = <T>(context: Context, attribute : Attr) => Variable<T>;