export async function loadTemplate(templatePath: string) {
    const response = await fetch(templatePath);
    const template = await response.text();

    const randomDiv = document.createElement('div');
    randomDiv.innerHTML = template;

    return randomDiv.firstElementChild;
}