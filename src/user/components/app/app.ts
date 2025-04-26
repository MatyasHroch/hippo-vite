import appTemplate from "./app.html?raw"
import {Context} from "../../../hippo";
import {firstPage} from "../pages/firstPage/firstPage";
import {secondPage} from "../pages/secondPage/secondPage";
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

    const firstPageActive = context.addComputed(() => {
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

    context.addWatcher(firstPageActive, () =>{
        console.log("We are at the first page!")
    })

    context.addChildren({
        firstPage, secondPage
    })
}