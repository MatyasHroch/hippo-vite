// @ts-ignore
import appTemplate from "./app.html";
import { Context } from "../../hippo";

import { list } from "./list/list";
import { myArticle2 } from "./my-article-2/myArticle2";
import { myArticle } from "./my-article/myArticle";

export async function app(context: Context) {
  const { variables } = context;

  // if we want the template
  context.setTemplate(appTemplate);

  // if we want to set child components
  // TODO - load these so we could
  context.addChildren({
    MyArticle: myArticle,
    list,
    MyArticle2: myArticle2,
  });

  const items = context.addVariable("items", {
    user1: {
      name: "John",
      age: 30,
      address: {
        city: "New York",
      },
    },
    user2: {
      name: "Jane",
      age: 25,
      address: {
        city: "Los Angeles",
      },
    },
    user3: {
      name: "Jim",
      age: 35,
      address: {
        city: "Chicago",
      },
    },
  });

  // we add variables one by one like this:
  context.addVariable("name", "Felix");
  context.addVariable("age", 20);
  const badInputs = context.addVariable("badInputs", true);
  setTimeout(() => {
    console.log("Bad Inputs value is " + badInputs.value);
    badInputs.set(false);
    console.log("Now we have set it to false");
    items.value.user2.age = 15;
    delete items.value.user3;
    items.set(items.value);
  }, 2 * 1000);

  setTimeout(() => {
    console.log("Bad Inputs value is " + badInputs.value);
    badInputs.set(true);
    console.log("Now we have set it to false");
  }, 5 * 1000);

  // Add a click handler that will be visible
  context.addHandler(function (index: any, key: any, event: any, name: string) {
    console.log("Button clicked!");
    console.log(index);
    console.log(key);
    console.log(event);
    console.log(name);
    badInputs.set(false);
  }, "onclick");

  context.addHandler((childId: number, event: PointerEvent) => {
    console.log({ event });
    console.log(
      "Hey I did it! In the app.ts I have the child's id: " + childId
    );
    console.log("And i have the event too:" + { event });
  }, "articleButtonCLicked");

  // TODO - change for the USER:
  // context.addHandlers({
  //   handler,
  //   handler,
  //   handler,
  //   handlerName: () => null,
  // });

  // context.addEventHandler("onArticleCLicked", handler)
}
