import {processComponent} from "../src/controllers/component";
import {Keywords} from "../enums/keywords";


export function createApp(rootComponent: Function, elementToMountId:string = Keywords.app) {
    if (elementToMountId.substring(0,1) == "#" ) {
        elementToMountId = elementToMountId.substring(1);
    }

    const elementToMount = document.getElementById(elementToMountId)

    processComponent(rootComponent, null, elementToMount);
    return rootComponent;
}
