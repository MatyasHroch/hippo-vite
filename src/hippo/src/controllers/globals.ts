import { createContext } from "./context";
import { Context } from "../../types";
import {IfNodeStructure} from "../../types/variable";

let globalContext: Context | null = null;
let globalIfNodes: Array<IfNodeStructure> = []

export function getGlobalContext() {
  if (!globalContext) {
    globalContext = createContext(null, 0);
  }
  return globalContext;
}

export function addGlobalIfNode(ifNode: IfNodeStructure){
  globalIfNodes.push(ifNode)
}

export function getGlobalIfNodes(){
  return globalIfNodes;
}
