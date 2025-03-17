import {Context} from "../../../types";
import {Variable} from "../../../types/variable";
import {isPrimitive} from "../../helpers/objects";
import {cloneElement} from "../template/template_main";
import {processTemplate} from "../component";
import {getIfPlaceholderTag} from "../template/template_if_nodes";
import { ForVariable} from "../../../types/for_variable";

export async function createFor(context: Context, dataToLoop: any, node: HTMLElement, nodesToSlot: Array<HTMLElement>) {
    // if it is a primitive, just return it
    if (isPrimitive(dataToLoop)) return null
    const forStructure = createForStructure(context, dataToLoop, node);

    // render it and then mount to the placeholder
    const result = await processTemplate({
            context,
            name: "if-node",
            template: cloneElement(node)
        },
        getIfPlaceholderTag(),
        nodesToSlot
    )
}

export function createForStructure(context: Context, dataToLoop: any, node: HTMLElement){
    const result = {}
    for (const key in dataToLoop){
        result[key]["data"] = dataToLoop[key];
        result[key]["node"] = cloneElement(node);
    }
    return result;
}

export function isForVariable<T>(variable: Variable<T>): variable is ForVariable<T> {
    return  variable["forNode"] &&
            variable["nodesToSlot"] &&
            variable["forStructures"]&&
            variable["itemName"] &&
            variable["indexName"] &&
            variable["keyName"] &&
            variable["placeHolder"]
}
