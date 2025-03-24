import {Variable} from "./variable";
import {ForItemStructure} from "./for_structure";

export type ForVariable<T> = Variable<T> & {
    forStructures: Array<ForItemStructure<T>>;
    nodesToSlot: Array<Element>;
    forNode: Element;
    itemName: string;
    indexName: string;
    keyName: string;
    placeHolder: Element;
}
