import {Context} from "./context";
import {Variable} from "./variable";

export type Watcher = <T>(context: Context, variable: Variable<T>, value: T, partialPath? : string) => Variable<T> | any;