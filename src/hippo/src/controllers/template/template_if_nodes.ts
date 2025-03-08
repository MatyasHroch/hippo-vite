import {processTemplate} from "../component";
import {Context} from "../../../types";
import {Keywords} from "../../../enums/keywords";
import {IfNodeStructure} from "../../../types/variable";

export function generateDerenderIf(context: Context, ifNode: IfNodeStructure, node: Element, placeholderDiv: Element, nodesToSlot: Array<Node> = null){
    return async function derenderIf(deep =false){
        // document.appendChild(placeholderDiv);
        node.parentNode.insertBefore(placeholderDiv, node.nextSibling);
        if (node.hasAttribute(Keywords.if)){
            node.removeAttribute(Keywords.if)
        }

        node.parentNode.removeChild(node);

        if (deep) {
            console.log("Im removing all the other things in the template");
        }
        ifNode.renderIf = generateRenderIf(context, ifNode, node, placeholderDiv, nodesToSlot);
    }
}

export function generateRenderIf(context: Context, ifNode: IfNodeStructure, node: Element, placeholderDiv: Element, nodesToSlot: Array<Node> = null){
    let clonedNode = document.createElement(node.nodeName);
    clonedNode.innerHTML = node.innerHTML;
    return async function renderIf(){
        clonedNode = document.createElement(node.nodeName);
        clonedNode.innerHTML = node.innerHTML;
        debugger
        const result = await processTemplate({
                context,
                name: "if-component",
                template: clonedNode
            },
            placeholderDiv,
            nodesToSlot,
        )
        placeholderDiv.replaceWith(result.template)
        // result.template.replaceWith(...result.template.childNodes)
        ifNode.derenderIf = generateDerenderIf(context, ifNode, clonedNode, placeholderDiv, );
        return result
    }

}

export function getIfPlaceholderTag(){
    const placeHolder = document.createElement("div");
    placeHolder.style.display = "none";
    return placeHolder;
}