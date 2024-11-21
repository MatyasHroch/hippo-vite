import {Context} from "../../types";

export async function render(context: Context){
    // TODO - implement the render
    console.log("Rendering... "+ context.templatePath)
    const template = await loadTemplate(context.templatePath)
    console.log({template})
    return template
}

export async function loadTemplate(templatePath: string) {
    const response = await fetch(templatePath);
    const template = await response.text();

    const randomDiv = document.createElement('div');
    randomDiv.innerHTML = template;

    return randomDiv.firstElementChild;
}