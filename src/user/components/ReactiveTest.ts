import { Context } from "../../hippo";
import "../styles/reactive-test.css";

export async function ReactiveTest(context: Context) {
  // 1. Basic variable reactivity
  const counter = context.addVariable("counter", 0);
  const message = context.addVariable("message", "Hello Reactive System!");

  // 2. Computed variables
  const doubleCounter = context.addComputed(() => counter.value * 2);
  const greeting = context.addComputed(
    () => `${message.value} (Counter: ${counter.value})`
  );

  // 3. Partial variables (nested object paths)
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

  // 4. Two-way binding (will be used in template)
  const inputValue = context.addVariable("inputValue", "");

  // 5. Conditional rendering (if nodes)
  const showDetails = context.addVariable("showDetails", true);

  // 6. List rendering (for loops)
  const items = context.addVariable("items", [
    { id: 1, name: "Item 1", active: true },
    { id: 2, name: "Item 2", active: false },
    { id: 3, name: "Item 3", active: true },
  ]);

  // 7. Component system (nested component)
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

  // Main template demonstrating all features
  context.setTemplate(`
        <div class="reactive-test">
            <!-- 1. Basic variable reactivity -->
            <h1>{{message}}</h1>
            <p>Counter: {{counter}}</p>
            <button bind:click="counter.set(counter.value + 1)">Increment</button>

            <!-- 2. Computed variables -->
            <h2>Computed Values</h2>
            <div class="computed-values">
                <p>Double counter: {{doubleCounter}}</p>
                <p>Greeting: {{greeting}}</p>
            </div>

            <!-- 3. Partial variables -->
            <h2>Partial Variables</h2>
            <div class="user-info">
                <p>User name: {{user.name}}</p>
                <p>Address: {{user.address.street}}, {{user.address.city}}</p>
                <p>Theme: {{user.preferences.theme}}</p>
            </div>

            <!-- 4. Two-way binding -->
            <h2>Two-way Binding</h2>
            <input model:value="inputValue" placeholder="Type something...">
            <p>Input value: {{inputValue}}</p>

            <!-- 5. Conditional rendering -->
            <h2>Conditional Rendering</h2>
            <button bind:click="showDetails.set(!showDetails.value)">
                {{showDetails ? 'Hide' : 'Show'}} Details
            </button>
            <div class="conditional-content" if="showDetails">
                <p>This is conditional content</p>
                <p>Counter value: {{counter}}</p>
            </div>

            <!-- 6. List rendering -->
            <h2>List Rendering</h2>
            <ul>
                <li for="item in items">
                    {{item.name}} ({{item.active ? 'Active' : 'Inactive'}})
                </li>
            </ul>

            <!-- 7. Component system -->
            <h2>Nested Component</h2>
            <div class="nested-component">
                <CounterButton></CounterButton>
            </div>

            <!-- 8. Attribute binding -->
            <h2>Attribute Binding</h2>
            <div class="theme-aware" bind:class="'theme-' + user.preferences.theme">
                Theme-aware content
            </div>
            <input bind:disabled="counter.value > 5" value="Disabled when counter > 5">

            <!-- 9. Text node binding -->
            <h2>Text Node Binding</h2>
            <div class="text-binding">
                <p>Current counter value: {{counter}}</p>
                <p>Message: {{message}}</p>
            </div>
        </div>
    `);
}
