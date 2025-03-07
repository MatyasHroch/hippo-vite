import {processTemplate} from "../component";
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";

export function generateDerenderIf(node:  Element, placeholderDiv : HTMLDivElement, ifAttribute : Attr){
    return async function derenderIf(deep =false){
        // document.appendChild(placeholderDiv);
        node.parentNode.insertBefore(placeholderDiv, node.nextSibling);
        if (node.hasAttribute(Keywords.if)){
            node.removeAttributeNode(ifAttribute)
        }

        node.parentNode.removeChild(node);

        if (deep) {
            console.log("Im removing all the other things in the template");
        }
    }
}

export function generateRenderIf(context: Context, node: Element, placeholderDiv: HTMLDivElement , nodesToSlot: Array<Node> = null ){
    return async function renderIf(){
        const result = await processTemplate({
                context,
                name: "if-component",
                template: node
            },
            placeholderDiv,
            nodesToSlot,
        )
        placeholderDiv.replaceWith(result.template)
        // result.template.replaceWith(...result.template.childNodes)
        return result
    }

}

export function getIfPlaceholderTag(){
    const placeHolder = document.createElement("div");
    placeHolder.style.display = "none";
    return placeHolder;
}