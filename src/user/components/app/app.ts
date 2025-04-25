import appTemplate from "./app.html?raw"
import {Context} from "../../../hippo";
export function app(context: Context){
    // we must set the template
    context.setTemplate(appTemplate);

    const { pageIndex, pages } = context.addVariables({
        pages: [{
            index: 0,
            name: "First Page"
        },{
            index: 1,
            name: "Second Page"
        },{
            index: 2,
            name: "Third Page"
        },],
        pageIndex: 0
    })

    context.addComputed(() => {
        return pageIndex.value === 0;
    }, "firstPageActive")
    context.addComputed(() => {
        return pageIndex.value === 1;
    }, "secondPageActive")
    context.addComputed(() => {
        return pageIndex.value === 2;
    }, "thirdPageActive")

    context.addComputed(() => {
        return pages.value[pageIndex.value];
    }, "activePage")

    context.addHandlers({
        changePageTo: (index: number) => {
            pageIndex.set(index);
        }
    })
}