// @ts-ignore
import appTemplate from "./main.html"
import {createApp, createContext, createOriginVariable, createPartialVariable} from "../hippo";
import { app } from "./components/app";
//
// const newVar = createOriginVariable<string>("name", "Albert");
//
// const nonReactiveName = newVar.value;
// console.log(" TADDYYY ");
// console.log(newVar);
//
//
// // TRYING PARTIAL
// type Address = {
//     postcode: number,
//     city: string,
// }
//
// type User ={
//     name: string,
//     surname: string,
//     address: Address
// }
// debugger
//
// const newContext = createContext();
//
// const reactiveUser = createOriginVariable<User>("user", {
//     name: "ALbert",
//     surname: "Miller",
//     address: {
//         postcode: 70200,
//         city: "Ostrava"
//     }
// })
//
// console.log(reactiveUser.value);
//
// const address = reactiveUser.value.address;
// const reactiveAddress = createPartialVariable<Address>(reactiveUser, "reactiveUser.value.address")
//
// console.log(address);
// console.log(reactiveAddress.value);

createApp(app);
