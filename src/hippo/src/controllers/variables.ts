import {Variable} from "../../types/variable";

export function createVariable(name: string, value: any, contextId: number): Variable {
  const fullName = name + contextId
  // TODO - add variable to the global Variables object via fullName

  return {
    name,
    contextId,
    fullName,

    inputNodes: [],
    textNodes: [],
    attributes: [],

    ifNodes: [],
    showNodes: [],

    onUpdates: [],
    updating: false,

    value: value,
    previousValue: undefined,
  };
}
