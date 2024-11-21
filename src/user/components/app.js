import appTemplate from "./app.html"

export async function app(context){
    // if we want the template
    context.templateString = appTemplate

    // we add variables one by one like this:
    context.addVariable("name", "Felix")
    context.addVariable("age", 20)

    // we can access the variables via context
    console.log("in my component.ts 2 which is js the variables are: ", context.variables)
    console.log({appTemplate})
}