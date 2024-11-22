export function stringToHtml(htmlString: string){
    const div = document.createElement("div")
    div.innerHTML = htmlString;

    return div.firstElementChild;
}
