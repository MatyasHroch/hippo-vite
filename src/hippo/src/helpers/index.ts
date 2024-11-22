export const parseTemplate = (template: Element) => {
    // Najdi elementy s atributy začínajícími na "bind:" nebo "model:"
    const elementsWithBindings = template.querySelectorAll("[bind\\:], [model\\:]");

    elementsWithBindings.forEach((element) => {
        for (const attr of element.attributes) {
            if (attr.name.startsWith("bind:") || attr.name.startsWith("model:")) {
                console.log(`Element: ${element.tagName}, Binding: ${attr.name}, Value: ${attr.value}`);
            }
        }
    });
};
