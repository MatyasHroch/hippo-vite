import {Context} from "./context";
import {Variable} from "./variable";

export type ForItemStructure<T> = {
    forItemContext: Context;
    forItemNode: Element;
    forItemVariable: Variable<T>;
}

export type ForLoopStructure<T> = {
    forItemStructures: Array<ForItemStructure<T>>,
    rootForLoopData: RootForData
}

export type RootForData = {
    originForNode: Element;
    nodesToSlot: Array<Element>;
    itemName: string;
    indexName: string;
    keyName: string;
    endPlaceHolder: Element;
}

// variableToIterate["forNode"] = node;
// variableToIterate["nodesToSlot"] = nodesToSlot
// variableToIterate["forStructures"] = forStructures;
// variableToIterate["itemName"] = itemName;
// variableToIterate["indexName"] = indexName;
// variableToIterate["keyName"] = keyName;
// variableToIterate["placeHolder"] = placeHolder