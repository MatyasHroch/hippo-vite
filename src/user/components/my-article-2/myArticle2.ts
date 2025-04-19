import template from "./myArticle2.html";
import { Context } from "../../../hippo";
import { list } from "../list/list";

export function myArticle2(context: Context) {
  // 1. Basic Variables
  const counter = context.addVariable("counter", 0);
  const message = context.addVariable("message", "Hello Reactive System!");

  // 2. Computed Values
  const doubleCounter = context.addComputed(() => counter.value * 2);
  const greeting = context.addComputed(
    () => `${message.value} (Counter: ${counter.value})`
  );

  // 3. Two-way Binding
  const inputValue = context.addVariable("inputValue", "");

  // 4. Conditional Rendering
  const showDetails = context.addVariable("showDetails", true);

  // 5. List Rendering
  const items = context.addVariable("items", [
    { id: 1, name: "Item 1", active: true },
    { id: 2, name: "Item 2", active: false },
    { id: 3, name: "Item 3", active: true },
  ]);

  // 6. Nested Objects
  const user = context.addVariable("user", {
    name: "John",
    address: {
      street: "123 Main St",
      city: "Springfield",
    },
    preferences: {
      theme: "dark",
      notifications: true,
    },
  });

  // 7. Nested Component
  context.addChildren({
    CounterButton: async (ctx: Context) => {
      const count = ctx.addVariable("count", 0);
      ctx.setTemplate(`
        <button bind:click="count.set(count.value + 1)">
          Count: {{count}}
        </button>
      `);
    },
  });

  // SETTING UP VARIABLES
  const heading = context.addVariable("heading", "My Heading");
  const paragraph = context.addVariable("paragraph", "My Paragraph content");
  const isCheckBoxEnabled = context.addVariable("isCheckBoxEnabled", true);
  const isButtonDisabled = context.addVariable(
    "isButtonDisabled",
    !isCheckBoxEnabled.value
  );
  const newParagraph = context.addVariable("newParagraph", "");
  const capitalizedHeading = context.addComputed(
    () => heading.value.toUpperCase(),
    "capitalizedHeading"
  );

  const myList = context.addVariable("myList", ["Hello", "Hi", "Hey"]);

  const userWithPartial = context.addVariable("user", {
    name: "Albert",
    surname: "Einstein",
    address: {
      city: "Ostrava",
      postCode: 70900,
    },
  });

  // WATCHERS - will be better
  newParagraph.watchers.push((c, v, value) => {
    checkButton();
    return v;
  });
  isCheckBoxEnabled.watchers.push((c, v, value) => {
    checkButton();
    return v;
  });

  const myObject = {
    name: "Richardo",
    surname: "Donovan",
    age: 18,
    address: {
      city: "Ostrava",
      postCode: 70900,
    },
  };

  for (const item in myObject) {
    console.log(item);
    console.log(myObject[item]);
  }

  setTimeout(() => {
    heading.set("Changed-Heading");

    const myUser = userWithPartial.value;
    myUser.address.city = "Olomouc";

    userWithPartial.set(myUser);

    // list experiment
    const list = myList.value;
    list[1] = "New Hello";
    list.pop();
    myList.set(list);
  }, 2 * 1000);

  function checkButton() {
    const isOk = newParagraph.value.length > 10 && isCheckBoxEnabled.value;
    if (isButtonDisabled.value !== isOk) return;
    isButtonDisabled.set(!isOk);
  }
  checkButton();

  // FOR THE TEMPLATE TO WORK
  context.addChildren({
    list,
  });
  context.setTemplate(template);
}
