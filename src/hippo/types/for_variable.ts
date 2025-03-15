import {Variable} from "./variable";
import {ForStructure} from "./for_structure";

export type ForVariable<T> = Variable<T> & {
    forStructures: Array<ForStructure<T>>;
    nodesToSlot: Array<Element>;
    forNode: Element;
    itemName: string;
}
