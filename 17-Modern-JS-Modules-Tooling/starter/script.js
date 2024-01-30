// Importing Modules
// need to set type="module" on script tag in HTML
console.log('Importing module');

/** 
// Import specific exported items to use
// import { addToCart, totalPrice as price, tq } from './shoppingCart.js';
// console.log(price, tq);

// Import all items under name
// import * as ShoppingCart from './shoppingCart.js';
// ShoppingCart.addToCart('eggs', 5);
// console.log(ShoppingCart.totalPrice, ShoppingCart.tq);

// default import (+ specific export -- not usually done)
import add, { cart } from './shoppingCart.js';
add('pizza', 2);
add('eggs', 5);
console.log(cart);

// Using top-level AWAIT (new in ES2022)
// Blocks execution of the module until await is resolved -- USE w/Caution
// const res = await fetch('https://jsonplaceholder.typicode.com/posts');
// const data = await res.json();
// console.log(data);

const getLastPost = async function () {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  return { title: data.at(-1).title, text: data.at(-1).body };
};

// not very clean approach
const lastPost = getLastPost();
lastPost.then(post => console.log(post));

// using top-level await
const lastPost2 = await getLastPost();
console.log(lastPost2);
*/

// Using NPM Module
// npm i lodash-es

// import cloneDeep from './node_modules/lodash-es/cloneDeep.js';

// Parcel version -- will determine path
import cloneDeep from 'lodash-es';

const state = {
  cart: [
    { product: 'bread', quantity: 5 },
    { product: 'eggs', quantity: 12 },
  ],
  user: { loggedIn: true },
};

const stateClone = Object.assign({}, state); // JS copy of an object
const stateDeepClone = cloneDeep(state); // CloneDeep copy of an object

state.user.loggedIn = false;

console.log(stateClone); // stateClone.user.loggedIn will be false
console.log(stateDeepClone); // stateDeepClone.user.loggedIn will be true

/** Parcel & 3rd Party Libraries
 *
 */

// Used with Parcel -- will reload a module without having to reload the entire webpage
// if (module.hot) {
//   module.hot.accept();
// }

// transpiling and polyfilling
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
