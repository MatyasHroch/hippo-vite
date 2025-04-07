import { processComponent } from "../src/controllers/component/component_main";
import { Keywords } from "../enums/keywords";

export async function createApp(
  rootComponent: Function,
  elementToMountId: string = Keywords.app
) {
  if (elementToMountId.substring(0, 1) == "#") {
    elementToMountId = elementToMountId.substring(1);
  }

  const elementToMount = document.getElementById(elementToMountId);

  await processComponent(rootComponent, null, elementToMount);
  return rootComponent;
}
