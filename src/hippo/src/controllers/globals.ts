import { createContext } from "./context";
import { Context } from "../../types";

let globalContext: Context | null = null;

export function getGlobalContext() {
  if (!globalContext) {
    globalContext = createContext(null, 0);
  }
  return globalContext;
}
