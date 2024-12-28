import {Variable} from "../../types/variable";

function createVariable<T>(value: T): Variable<T> {
  const handler: ProxyHandler<Variable<any>> = {
    get(target, prop) {
      const

      if (prop === "value") {

        if (notPrimitive(target.value)) {
          const name = target.name;
          const value = target.value.value;
          return {
            name: value
          };
        }// the value would then be a Proxy, so call value
        return target.value;
      }

      if (prop === "_this") {
        return target;
      }

      return target
    },
    set(target, prop, newValue) {
      target[prop] = newValue; // Aktualizace hodnoty
      return true; // Proxy vyžaduje návrat true, pokud je nastavení úspěšné
    },
  };

  return new Proxy(value, handler) as Variable<T>;
}

function notPrimitive(object: any) {
  return typeof object === "object" && object !== null;
}


const user = createVariable({
  name: "adlof",
  address: { city: "ostrava", postcode: 70900 },
});

// Přístup k objektu
console.log(user); // Proxy objekt
console.log(user.value); // { name: "adlof", address: { city: "ostrava", postcode: 70900 } }

// Přístup k podobjektům
console.log(user.name); // Proxy objekt
console.log(user.value);

console.log(user.address.city); // Proxy objekt
console.log(user.address.city.value); // "ostrava"

console.log(user.address.value); // { city: "ostrava", postcode: 70900 }

// Změna hodnot
// user.name = createVariable("nový_adlof");
console.log(user.name.value); // "nový_adlof"

user.address.city = createVariable("praha");
console.log(user.address.city.value); // "praha"

// export function createVariable(name: string, value: any, contextId: number): Variable {
//   const fullName = name + contextId
//   // TODO - add variable to the global Variables object via fullName
//
//   const newVariable =  {
//     name,
//     contextId,
//     fullName,
//
//     inputNodes: [],
//     textNodes: [],
//     attributes: [],
//
//     ifNodes: [],
//     showNodes: [],
//
//     onUpdates: [],
//     updating: false,
//     value: undefined,
//
//     childrenVariables: [],
//     parentVariable: null,
//
//     previousValue: undefined,
//   };
//
//   // if the value is not a primitive it is an object, and we will change all its values to be a Variable
//   if (notPrimitive(value)) {
//     const children = []
//     for (const key in value) {
//
//       const childVariable = createVariable(key, value[key], contextId);
//
//       // here we set the variables parent variable and add it to the children variable
//       childVariable.parentVariable = newVariable;
//       children.push(childVariable);
//
//       // now, under the key is variable, not just an ordinary object
//       value[key] = childVariable;
//     }
//   }
//
//   // here we set the changed value
//   newVariable.value = value;
//
//   return newVariable;
// }
