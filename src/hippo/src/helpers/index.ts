// TODO - use this
export function parseTemplate (template: Element) {
    // Finds all elements with attributes starting with "bind:" or "model:"
    const elementsWithBindings = template.querySelectorAll("[bind\\:], [model\\:]");

    for (const element of elementsWithBindings) {
        for (const attr of element.attributes) {
            if (attr.name.startsWith("bind:") || attr.name.startsWith("model:")) {
                console.log(`Element: ${element.tagName}, Binding: ${attr.name}, Value: ${attr.value}`);
            }
        }
    }
}
