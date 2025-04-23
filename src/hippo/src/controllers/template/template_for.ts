import { Keywords } from "../../../enums/keywords";
import {Context, ContextType} from "../../../types";
import { getVariableByName } from "./template_attributes";
import { cloneContext } from "../context";
import { cloneElement } from "./template_main";
import { processTemplate } from "../component/component_main";
import { createPartialVariable } from "../variable/variable_partials";
import { ForItemStructure, RootForData } from "../../../types/for_structure";
import { Variable } from "../../../types/variable";
import { createComputedVariable } from "../variable/variable_computed";
import { getPlaceholderTag } from "../../helpers/template";

export async function renderForStructures<T>(
  variableToIterateContext: Context,
  variable: Variable<T>,
  oldForStructures: Array<ForItemStructure<T>>,
  rootForLoopData: RootForData
) {
  const newDataToIterate = variable.value;
  const {
    itemName,
    indexName,
    keyName,
    originForNode,
    endPlaceHolder,
    nodesToSlot,
  } = rootForLoopData;

  const newForLoopItemStructures: Array<ForItemStructure<T>> = [];
  let index = 0;

  for (const key in newDataToIterate) {
    const newForItem = newDataToIterate[key];
    const itemStructureIndex = oldForStructures.findIndex(
      (forStructure: ForItemStructure<any>) =>
        newForItem === forStructure.forItemContext.variables[itemName]?.value
    );
    let newForItemStructure: ForItemStructure<T>;
    let forItemTemplate: Element;

    if (itemStructureIndex < 0) {
      // here we need to create a whole new structure (context, template)
      //      here we create the context
      const newForItemContext = createForItemContext(
        variableToIterateContext,
        variable,
        key,
        originForNode,
        itemName,
        indexName,
        keyName,
        index
      );
      //      and here the template
      forItemTemplate = await createForItemTemplate(
        newForItemContext,
        endPlaceHolder,
        nodesToSlot,
        false
      );

      // here we put the attributes together to the FofStructure
      newForItemStructure = {
        forItemNode: forItemTemplate,
        forItemContext: newForItemContext,
        forItemVariable: newForItemContext.variables[itemName],
      };
    } else {
      // we just need to put it to the
      // so the structure stays the same after some changes
      newForItemStructure = oldForStructures[itemStructureIndex];
    }

    newForLoopItemStructures.push(newForItemStructure);
    index++;
  }

  // we remove the old nodes from the real DOM
  for (const oldForLoopItemStructure of oldForStructures) {
    oldForLoopItemStructure.forItemNode.remove();
  }

  for (const newForLoopItemStructure of newForLoopItemStructures) {
    putBeforeElement(endPlaceHolder, newForLoopItemStructure.forItemNode);
  }
}

export async function processFor(
  context: Context,
  originForNode: Element,
  nodesToSlot: Array<Element>
) {
  // if (!node.hasAttribute(Keywords.for)) return;
  const forString = originForNode.getAttribute(Keywords.for);
  originForNode.removeAttribute(Keywords.for);
  // we do not need the origin for node anymore
  const splitForString = forString.split(Keywords.in);

  if (splitForString.length < 2) return;

  let [variablePart, dataName] = splitForString;

  const splitVariablePart = variablePart.split(",");
  const itemName =
    splitVariablePart.length > 0 ? splitVariablePart[0].trim() : null;
  const indexName =
    splitVariablePart.length > 1 ? splitVariablePart[1].trim() : null;
  const keyName =
    splitVariablePart.length > 2 ? splitVariablePart[2].trim() : null;

  dataName = dataName.trim();

  if (!itemName) return null;

  const forStructures: Array<ForItemStructure<any>> = [];
  const contexts: Array<Context> = [];

  // TODO - get from all lists variables, properties, computed and so on
  // TODO - get the partial variable as well if the variable is not right away
  // TODO - better code here
  const variableToIterate = getVariableByName(context, dataName);
  if (!variableToIterate) return null;

  // if (!variableToIterate) return null;
  const dataToIterate = variableToIterate.value;

  let index = 0;
  // creating the context with the template
  for (const itemKey in dataToIterate) {
    const itemContext = createForItemContext(
      context,
      variableToIterate,
      itemKey,
      originForNode,
      itemName,
      indexName,
      keyName,
      index
    );

    // just for the first render, we generate the index like this
    index++;

    // we stack the contexts so
    contexts.push(itemContext);
  }

  const endPlaceHolder = getPlaceholderTag();
  // We add the for information to the variable
  const rootForLoopData = {
    itemName,
    indexName,
    keyName,
    originForNode,
    nodesToSlot,
    endPlaceHolder,
  };

  // rendering and mounting
  putBeforeElement(originForNode, endPlaceHolder);
  for (const forItemContext of contexts) {
    const template = await createForItemTemplate(
      forItemContext,
      endPlaceHolder,
      nodesToSlot
    );
    forStructures.push({
      forItemContext: forItemContext,
      forItemNode: template,
      forItemVariable: forItemContext.variables[itemName],
    });
  }

  variableToIterate.forStructuresArray.push({
    forItemStructures: forStructures,
    rootForLoopData,
  });

  // we do not need the original node to be in the real DOM anymore
  originForNode.remove();
}

export function createForItemContext(
  context: Context,
  variableToIterate: Variable<any>,
  itemKey: string,
  node: Element,
  itemName: string,
  indexName: string,
  keyName: string,
  index: number
) {
  const itemContext = cloneContext(context, ContextType.for);

  // to have the iteration value in the for loop
  itemContext.variables[itemName] = createPartialVariable(
    variableToIterate,
    variableToIterate.name + ".value." + itemKey
  );

  // to have the template inside the context and
  itemContext.template = cloneElement(node);

  // to have the index in the for loop
  if (indexName) {
    // TODO - create not origin, but COMPUTED variable, the index will rerender everytime the iterable data are changed
    itemContext.variables[indexName] = createComputedVariable(
      itemContext,
      () => {
        if (!variableToIterate) return null;
        const dataToIterate = variableToIterate.value;
        if (!dataToIterate) {
          debugger
          return null
        };
        return Object.keys(dataToIterate).indexOf(itemKey);
      },
      indexName,
      [variableToIterate]
    );
  }

  // to have the key in the for loop
  if (keyName) {
    // TODO - create not origin, but COMPUTED variable, the index will rerender everytime the iterable data are changed
    itemContext.variables[keyName] = createComputedVariable(
      itemContext,
      () => {
        if (!variableToIterate) return null;
        const dataToIterate = variableToIterate.value;
        // we need to find the key in the dataToIterate of the itemData because it can change and we need to have the correct key
        const itemData = dataToIterate[itemKey];
        for (const key in dataToIterate) {
          if (dataToIterate[key] === itemData) {
            return key;
          }
        }
        return null;
      },
      keyName,
      [variableToIterate]
    );
  }

  return itemContext;
}

export function putBeforeElement(
  placeholder: Element,
  elementToPutBefore: Element
) {
  const parent = placeholder.parentNode;
  if (!parent) return;
  return parent.insertBefore(elementToPutBefore, placeholder);
}

export async function createForItemTemplate(
  forItemContext: Context,
  nodeToPutBefore: Element,
  nodesToSlot: Array<Element>,
  mount: boolean = true
) {
  const newComponent = {
    name: "fake-for-component-" + forItemContext.id,
    context: forItemContext,
    template: forItemContext.template,
  };
  return (
    await processTemplate(
      newComponent,
      nodeToPutBefore,
      nodesToSlot,
      null,
      putBeforeElement,
      mount
    )
  ).template;
}
