'use strict';

/* 
///////////////////////////////////////
// Coding Challenge #2


This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.

GOOD LUCK 😀
*/

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  document.body.addEventListener('click', () => (header.style.color = 'blue'));
})();

/** 
const runOnce = function () {
  console.log('This will never run again!');
};

runOnce();
runOnce(); // oops it can be run again!

//IIFE -- Immediately Invoked Function Expression
(function () {
  const isPrivate = 23;
  console.log('This will actually never run again!');
})();
// console.log(isPrivate); // ERRORS because isPrivate is inside scope of the function

// IIFE Arrow Function
(() => console.log('This arrow function will never run again!'))();

// more typical way to protect (private) variables than IIFE
{
  const isPrivate = 23;
}
// console.log(isPrivate); // ERRORS because isPrivate is inside the block

// CLOSURES
// Functions will have access to the Variable Environment (VE) of the Execution Context (EC) in which it was created
// Closure: VE attaches to function, exactly as it was at the time and place the function was created, even after that EC is gone

// Closure: gives a function access to all variables of its parent function, even AFTER that parent function has returned/finished executing. The function keeps a reference to its outer scope, which preserves the scope chain.

// Makes sure a function doesn't lose connection to the variables that existed at the function's birth place

const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++; // function will continue to have access to the passengerCount variable (CLOSURE!)
    console.log(`${passengerCount} passengers`);
  };
};

const booker = secureBooking();

booker(); // is calling the returned function
booker(); // continues to have access to passengerCount
booker();

console.dir(booker); //views details of the function, including info on the closure under scope

// Example 1
// f is defined in the global scope, but is then assigned a function value within a function call
let f;
const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};

g();
f();
console.dir(f); // closure access to a variable
h(); //reassigns f to the new function
f();
console.dir(f); // closure access to b variable

// Example 2
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;

  setTimeout(() => { // creates a closure -- will have access to the perGroup, n, and wait variables
    console.log(`We are now boarding all ${n} passengers.`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, wait * 1000);

  console.log(`Will start boarding in ${wait} seconds.`);
};

boardPassengers(180, 3);

*/
/* 
///////////////////////////////////////
// Coding Challenge #1


Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

GOOD LUCK 😀
*/
/** 
const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  // 1. Create a method called 'registerNewAnswer' on the 'poll' object
  registerNewAnswer() {
    // 1.1 Display a prompt window for the user to input the number of the selected option
    // Make sure to check if the input is a number and if the number makes sense
    let answer = Number(
      prompt(
        `${this.question}\n${this.options.join('\n')}\n(Write option number)`
      )
    );

    if (
      typeof answer === 'number' &&
      answer >= 0 &&
      answer < this.answers.length
    ) {
      // 1.2 Based on the input number, update the answers array.
      this.answers[answer]++;
      // 4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.
      this.displayResults();
      this.displayResults('string');
    } else {
      alert('Not a valid answer');
      this.registerNewAnswer();
      return;
    }

    // JONAS SOLUTION
    // typeof answer === 'number' &&
    //   answer < this.answers.length &&
    //   this.answers[answer]++;
  },
  // 3. Create a method 'displayResults' which displays the poll results
  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      console.log(`Poll results are ${this.answers.join(', ')}`);
    }
  },
};
// 2. Call this method whenever the user clicks the "Answer poll" button.
document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

// BONUS: Use the 'displayResults' method to display the 2 arrays in the test data.
const testData1 = { answers: [5, 2, 3] };
const testData2 = { answers: [1, 5, 3, 9, 6, 1] };

const displayDataResults = poll.displayResults;

const displayArrayData1 = displayDataResults.bind(testData1, 'array');
const displayStringData1 = displayDataResults.bind(testData1, 'string');
const displayArrayData2 = displayDataResults.bind(testData2, 'array');
const displayStringData2 = displayDataResults.bind(testData2, 'string');

displayArrayData1();
displayStringData1();
displayArrayData2();
displayStringData2();

// JONAS ANSWER
poll.displayResults.call({ answers: [5, 2, 3] });
poll.displayResults.call({ answers: [5, 2, 3] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');

*/
/** 
const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}.`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book('234', 'Jonas');
lufthansa.book('532', 'John Smith');

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};

// sets book to the method/function of lufthansa.book
const book = lufthansa.book;

// DOES NOT WORK --> no context for this
// book(23, 'Sarah Williams');

// CALL method
// first argument is for the calling method that this keyword points to
// subsequent arguments are as defined for the function itself
book.call(eurowings, 23, 'Sarah Williams');
console.log(eurowings);

book.call(lufthansa, 144, 'John Jones');
console.log(lufthansa);

const swiss = {
  airline: 'Swiss Air',
  iataCode: 'LX',
  bookings: [],
};
book.call(swiss, 558, 'George Cool');

// APPLY METHOD
const flightData = [583, 'Mike Smith'];
// first argument is for this calling method, second argment is array of values function expects
book.apply(swiss, flightData);
console.log(swiss);

// works in place of apply method for an array, but used more in modern JS
book.call(swiss, ...flightData);

// BIND METHOD
// binds the eurowings object as this in the function
const bookEW = book.bind(eurowings);

const bookLH = book.bind(lufthansa);
const bookSW = book.bind(swiss);

bookEW(23, 'John Williams');
console.log(eurowings);

// bind can also be called with and set n arguments of the function call
// Refered to as "Partial Application"
const bookEW23 = book.bind(eurowings, 23);
bookEW23('Jacob Williams');
console.log(eurowings);

// With Event Listeners

lufthansa.planes = 300;
lufthansa.buyPlane = function () {
  console.log(this);
  this.planes++;
  console.log(this.planes);
};

// DOES NOT WORK --> this within method points to the element on the page
// document.querySelector('.buy').addEventListener('click', lufthansa.buyPlane);

// BINDs lufthansa to the buyPlane method
document
  .querySelector('.buy')
  .addEventListener('click', lufthansa.buyPlane.bind(lufthansa));

// Partial Application
const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

// use null because there is no need to set a this value for this function
const addVAT = addTax.bind(null, 0.23);
console.log(addVAT(100));

// CHALLENGE
// ANSWER

const addTaxRate = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};

const addVAT2 = addTaxRate(0.23);
console.log(addVAT2(100));
*/
/**
 * Functions returning functions
const greet = function (greeting) {
  return function (name) {
    // works because of closures
    console.log(`${greeting} ${name}.`);
  };
};

const greeterHey = greet('Hey');

greeterHey('Jason');
greeterHey('John');

greet('Hello')('Jonas'); // immediately call returned function

// Challenge
const greet2 = greeting => name => console.log(`${greeting} ${name}`);
const greetHi = greet2('Hi')('Mike');

// Answer
const greetArr = greeting => name => console.log(`${greeting} ${name}`);
greetArr('Hi')('Jonas');
 */
/** 
const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase();
};

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

// higher-order function
const transformer = function (str, fn) {
  console.log(str);
  console.log(`Transformed string: ${fn(str)}`);
  console.log(`Transformed by: ${fn.name}`);
};
transformer('JavaScript is the best!', upperFirstWord);
transformer('JavaScript is the best!', oneWord);

// using as a callback function
const high5 = function () {
  console.log('🖐🏻');
};
['John', 'Jacob', 'Joe'].forEach(high5);
*/
/** 
const bookings = [];

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) {
  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH123', 2, 800);
createBooking('LH123', 4);
createBooking('LH123', undefined, 100); // skip parameter to leave at default

const flight = 'LH234';
const passenger1 = {
  name: 'Jason H',
  passport: 24739479284,
};

const checkIn = function (flightNum, passenger) {
  flightNum = 'LH999';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 24739479284) {
    console.log('Check In');
  } else {
    console.log('Wrong passport');
  }
};

checkIn(flight, passenger1); // flight is primitive type, passenger1 is reference to object on heap
console.log(flight);
console.log(passenger1); // name is "Mr. Jason H"

const newPassport = function (person) {
  person.passport = Math.trunc(Math.random() * 1000000000);
};

newPassport(passenger1);
checkIn(flight, passenger1);
console.log(passenger1); // updated passport
*/
