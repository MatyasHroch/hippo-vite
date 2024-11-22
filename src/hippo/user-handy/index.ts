import {createComponent} from "../src/controllers/component";

export async function createApp(rootComponent: Function, elementToMountId:string) {
    if (elementToMountId.substring(0,1) !== "#" ) {
        elementToMountId = "#" + elementToMountId
    }

    const elementToMount = document.getElementById(elementToMountId)

    await createComponent(rootComponent, null, elementToMount);
    return rootComponent;
}
