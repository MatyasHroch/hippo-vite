import {processTemplate} from "../component";
import {Context} from "../../../types";

export function generateDerenderIf(node:  Element, placeholderDiv : HTMLDivElement, ifAttribute : Attr){
    return async function derenderIf(deep =false){
        // document.appendChild(placeholderDiv);
        node.parentNode.insertBefore(placeholderDiv, node.nextSibling);
        node.removeAttributeNode(ifAttribute)

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

