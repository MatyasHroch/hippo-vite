import {Context} from "./context";
import {Computed, Variable} from "./variable";

export type Watcher = <T>(context?: Context, variable?: Variable<T> | Computed<T>, value?: T, partialPath? : string) => Variable<T> | any;