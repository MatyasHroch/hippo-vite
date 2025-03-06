import {Context} from "./context";
import {Variable} from "./variable";

export type Handler = <T>(context: Context, variable: Variable<T>, value: T) => Variable<T> | any;