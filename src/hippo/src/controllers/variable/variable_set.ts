import { Context } from "../../../types";
import { Variable } from "../../../types/variable";
import { derenderIfNode, renderIfNode } from "../template/template_if_nodes";
import { isPrimitive } from "../../helpers/objects";
import { renderForStructures } from "../template/template_for";

// this function actually sets the variable's value
export function _setVariableValue<T>(
  context: Context,
  variable: Variable<T>,
  value: T
) {
  variable.previousValue = variable.value;
  variable.value = value;
}

export async function setVariable<T>(
  context: Context,
  variable: Variable<T>,
  value: T,
  partialPath: string = null
) {
  // here we set the variable value
  const isNotObject = !value || !Object.keys(value);
  if (isNotObject && value === variable.value) {
    return;
  }

  _setVariableValue(context, variable, value);

  await callAllWatchers(context, variable, value, partialPath);

  return variable;
}

export async function callAllWatchers<T>(context:Context, variable:Variable<T>, value: T, partialPath :string){
  // here it just triggers all the watchers
  for (const watcher of variable.watchers) {
    await watcher(context, variable, value, partialPath);
  }
}

export function rerenderTextNodes<T>(
  context: Context,
  variable: Variable<T>,
  value: T
) {
  for (const node of variable.textNodes) {
    // changing just the text content
    node.textContent = variable.value as string;
  }
  return variable;
}

export function rerenderAttributes<T>(
  context: Context,
  variable: Variable<T>,
  value: T
) {
  for (const attributeNode of variable.attributes) {
    renderAttribute(attributeNode, value);
  }
  return variable;
}

export function renderAttribute(
  attributeNode: { node: Element; attribute: Attr },
  value: any
) {
  // we set the attribute to the value
  attributeNode.attribute.value = value as string;

  // if it is a boolean attribute, we add it or remove it from the
  if (isBooleanAttribute(attributeNode.attribute)) {
    if (value) {
      attributeNode.node.attributes.setNamedItem(attributeNode.attribute);
    } else {
      attributeNode.node.removeAttribute(attributeNode.attribute.name);
    }
  }
}

export function rerenderDependencies<T>(
  context: Context,
  variable: Variable<T>,
  value: T
) {
  // it is automatically done already, this function is not needed for now
  return variable;
}

export async function rerenderIfNodes<T>(
  context: Context,
  variable: Variable<T>,
  value: T
) {
  if (value) {
    for (const ifNode of variable.ifNodes) {
      await renderIfNode(ifNode);
    }
  } else {
    for (const ifNode of variable.ifNodes) {
      derenderIfNode(ifNode);
    }
  }
}

export async function rerenderPartials<T>(
  context: Context,
  variable: Variable<T>,
  value: T,
  changedPartialPath: string = null
) {
  for (const partialName in variable.partialVariables) {
    const partialVariable = variable.partialVariables[partialName];

    let currentValue = value;
    if (!currentValue) continue;
    for (const key of partialName.split(".")) {
      // if I get to some point where the key does not exist, the objectPath is invalid
      if (currentValue[key] === undefined) {
        await setVariable(partialVariable.context, partialVariable, undefined)
        new Error(`Invalid path in partial variable: ${partialName}`);
      }
      currentValue = currentValue[key];
    }
    if (!changedPartialPath || isCurrentPathPrefix(changedPartialPath, partialVariable.pathFromOrigin)){
      await setVariable(partialVariable.context, partialVariable, currentValue)
    }

  }
  return variable;
}

function isCurrentPathPrefix(changedPartialPath :string, currentPartialPath : string){
  return changedPartialPath.startsWith(currentPartialPath) ;
}

export async function rerenderFor(
  context: Context,
  variable: Variable<any>,
  value: any
) {
  if (isPrimitive(value)) return variable;

  for (const forStructures of variable.forStructuresArray) {
    await renderForStructures(
      context,
      variable,
      forStructures.forItemStructures,
      forStructures.rootForLoopData
    );
  }
}

// export async function oldRerenderFor(context: Context, variable: Variable<any>, value: any){
//     if (isPrimitive(value)) return variable
//
//     const newData = value;
//     const oldForStructures = variable.forStructures;
//     if (!oldForStructures) {
//         console.log("We dont have the 'forStructures', so no for things")
//         return
//     }
//     const itemName = variable.itemName
//
//     // TODO - reduce the forStructures by those items that has been deleted
//     const newForStructures: Array<ForStructure<any>> = [];
//
//     let placeholder = variable.placeHolder;
//
//     let index = 0;
//     for (const key in newData){
//         const newForItem = newData[key];
//         const itemStructureIndex = oldForStructures.findIndex(
//             (forStructure: ForStructure<any>)=> newForItem === forStructure.context.variables[itemName].value
//         );
//         let newForStructure :ForStructure<any>;
//         let forItemTemplate: Element;
//         if (itemStructureIndex < 0){
//             // here we need to create a whole new structure (context, template)
//             //      here we create the context
//             const newForItemContext = createForItemContext(context, variable, key, variable.forNode, itemName, variable.indexName, variable.keyName, index)
//             //      and here the template
//             forItemTemplate = await createForItemTemplate(newForItemContext, placeholder, variable.nodesToSlot, false)
//
//             // here we put the attributes together to the FofStructure
//             newForStructure = {
//                 itemNode: forItemTemplate,
//                 context: newForItemContext,
//                 variable: newForItemContext.variables[itemName]
//             }
//         }
//         else {
//             // we just need to put it to the
//             // so the structure stays the same after some changes
//             newForStructure = oldForStructures[itemStructureIndex]
//         }
//
//         newForStructures.push(newForStructure);
//         index ++;
//     }
//
//     for (const oldStructure of oldForStructures){
//         oldStructure.itemNode.remove()
//     }
//
//
//     // TODO - now mount it by the right order
//     for(const newStructure of newForStructures){
//         const forNode = newStructure.itemNode
//         putBeforeElement(placeholder, forNode)
//     }
//
//     return variable;
// }

const booleanAttributes = new Set([
  "checked",
  "disabled",
  "readonly",
  "required",
  "open",
  "selected",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "multiple",
  "novalidate",
  "reversed",
  "ismap",
  "defer",
  "hidden",
  "playsinline",
  "async",
  "default",
  "inert",
  "nomodule",
  "formnovalidate",
  "allowfullscreen",
  "itemscope",
  "sortable",
]);

export function isBooleanAttribute(attr: Attr): boolean {
  return booleanAttributes.has(attr.name);
}
