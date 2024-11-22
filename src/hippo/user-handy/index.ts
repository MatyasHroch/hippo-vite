import {createComponent} from "../src/controllers/component";

export function createApp(rootComponent: Function, elementToMountId:string) {
    if (elementToMountId.substring(0,1) == "#" ) {
        elementToMountId = elementToMountId.substring(1);
    }

    const elementToMount = document.getElementById(elementToMountId)

    createComponent(rootComponent, null, elementToMount);
    return rootComponent;
}
