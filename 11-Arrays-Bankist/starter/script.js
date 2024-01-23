'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Jane Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // clears out current contents of Movements container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const inSum = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${inSum}€`;

  const outSum = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${outSum}€`;

  const intSum = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${intSum}€`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  displayMovements(acc.movements);
};

const resetUI = function () {
  const emptyAcc = {
    movements: [],
    interestRate: 0,
  };
  labelWelcome.textContent = `Log in to get started`;
  updateUI(emptyAcc);
  containerApp.style.opacity = 0;
};

// Event Handlers
let currentAccount;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents the page from reloading on submit of form

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // optional chaining
    // update welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    // display hidden content
    containerApp.style.opacity = 100;
    // clear login fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // disply account movement details
    updateUI(currentAccount);
  } else {
    alert('Invalid Login Details!');
    // hide content
    resetUI();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting and reloading page
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // validate amount is valid
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username // optional chaining -- will be false if receiverAccount doesn't exist
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // update display
    updateUI(currentAccount);
  } else {
    alert(`Invalid amount entered`);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`loan button clicked`);

  const loanAmt = Number(inputLoanAmount.value);

  if (
    loanAmt > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmt * 0.1)
  ) {
    console.log(`loan approved`);
    currentAccount.movements.push(loanAmt);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  } else {
    alert(`Loan not approved!`);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    resetUI();
  } else {
    alert(`invalid account details`);
  }

  inputCloseUsername.value = inputClosePin.value = ''; // clear form
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
  btnSort.textContent = sorted ? 'NO SORT' : '↓ SORT';
});

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/** 
// Practicing Array Method

// 1. Get all bank deposits
const bankDepositSum = accounts
  .flatMap(acc => acc.movements) // grab movements from all accounts into a flat array
  .filter(mov => mov > 0) // take only the positive movements
  .reduce((sum, cur) => sum + cur, 0); // add them all up
console.log(bankDepositSum);

// 2. Count deposits >= $1000
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // .filter(mov => mov >= 1000).length;
  .reduce((cnt, cur) => (cur >= 1000 ? ++cnt : cnt), 0); // use reduce() to count || use prefix ++cnt to increase PRIOR TO returning the value
console.log(numDeposits1000);

// 3. Create new object
const { deposits, withdrawals } = accounts //destructure object into separate variables
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals -= cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  ); // create an empty object to start
console.log(deposits, withdrawals);

// 4. Create simple function
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  console.log(titleCase);
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
/** 
// Working With Arrays -- Which Array Method To Use

I want...

To mutate original array:
Add:
  * .push | .unshift
Remove:
  * .pop | .shift | .splice
Others:
 * .revese | .sort | .fill

A new array

Compute from original:
  * .map
Filtered using condition:
  * .filter
Portion of original:
  * .slice
Adding original to other
  * .concat
FLatting the original
  * .flat
  * .flatMap

An array index

Based on value:
  * .indexOf
Based on test Condition
  * .findIndex

An array element

Baseed on test condition:
  * .find

Know if an Array includes

Based on value:
  * .includes

Based on test condition
  * .some
  * .every

A new String

Based on a join separator:
  * .join

To Transform to value

Based on accumulator
  * .reduce

To just loop array

Based on callabck
  * .forEach

*/
/** 
const arr = [1, 2, 3, 4, 5, 6, 7];

let x = new Array(7); //creates an empty array of 7
x.fill(1);
console.log(x);

x = new Array(7);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

const newArray = Array.from({ length: 7 }, () => 1);
console.log(newArray);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const diceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
console.log(diceRolls);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
*/
/** 
// Array Sorting

// Sorting Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha']; // mutates the array
console.log(owners.sort());
console.log(owners);

console.log(movements);
console.log(movements.sort()); // sorts numbers as string values, which is not what we want

// Sorting Numbers

// ASCENDING
movements.sort((a, b) => {
  // 450, -450
  // return < 0, a, b (keep order)
  // return > 0, b, a (switch order)
  if (a > b) return 1; // needs to be greater than 0
  if (a < b) return -1; // needs to be a negative number
});
console.log(movements);

// DESCENDING
movements.sort((a, b) => {
  // 450, -450
  // return < 0, a, b (keep order)
  // return > 0, b, a (switch order)
  if (a > b) return -1; // needs to be greater than 0
  if (a < b) return 1; // needs to be a negative number
});
console.log(movements);

// ASCENDING
movements.sort((a, b) => a - b); // simplified
console.log(movements);

// DESCENDING
movements.sort((a, b) => b - a); // simplified
console.log(movements);
*/
/** 
// Some -- array method to test if ANY value of an array meets the criteria

console.log(movements);
console.log(movements.includes(-130)); // testing for equality (does one member of array === -130?)

const anyDeposits = movements.some(mov => mov > 0); //checks for a condition (ie any mov > 0)
console.log(anyDeposits);

// Every -- array method to test if every value of an array meets the criteria
console.log(movements.every(mov => mov > 0)); // false because there are negative movements
console.log(account4.movements.every(mov => mov > 0)); // true because all movements are positive

// Separate callback
const deposit = mov => mov > 0; // can define the function as a variable
console.log(movements.some(deposit)); // pass in the variable function instead of repeating it. DRY

// Flat -- array method

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log(arr.flat()); // flattens the nested arrays and returns a single "flat" array -- ONLY GOES 1 LEVEL DEEP

// flatMap -- array method

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat()); // [1,2] and [5,6] are still nested arrays
console.log(arrDeep.flat(2)); // defines how DEEP to go into flattening arrays

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);

const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// chain the operations
const overalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

// using chaining with FlatMap -- combines map and flat into single function, but only supports 1 level deep arrays
const overalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance3);
*/
/** 
// Find Method on Arrays
// Returns ONLY first element in the array that results in a TRUE result
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.username === 'jd' && acc.pin === 2222);
console.log(account);
*/
/* 

///////////////////////////////////////
// Coding Challenge #3

Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAgeArrow = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, _, arr) => acc + age / arr.length, 0);
console.log(calcAverageHumanAgeArrow([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAgeArrow([16, 6, 10, 5, 6, 1, 4]));
*/
/** 
const eurToUsd = 1.1;
// Pipeline processing the data to an output (chaining)
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  // DEBUG
  // .map((mov, i, arr) => {
  //   console.log(arr);
  //   return mov * eurToUsd;
  // })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);
*/
/* 

///////////////////////////////////////
// Coding Challenge #2

Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = function (ages) {
  //   1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAges);

  // 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
  const olderDogs = humanAges.filter(age => age >= 18);
  console.log(olderDogs);

  // 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
  const avgOlderAge =
    olderDogs.reduce((acc, age) => acc + age, 0) / olderDogs.length;
  console.log(avgOlderAge);

  // Answer Alternate to calculate average human age of all adult dogs
  const average = olderDogs.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );

  return avgOlderAge;
};
// 4. Run the function for both test datasets
console.log([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log([16, 6, 10, 5, 6, 1, 4]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/
/** 
// Reduce Array Method

console.log(movements);

// accumulator -> adds everything to this (snowball)
// second variable of reduce is value to start accumulator
const balance = movements.reduce(function (accum, cur) {
  return accum + cur;
}, 0);

console.log(balance);

// Get greatest deposit amount
const maximum = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(maximum);
*/
/** 
// Filter Array Method
// funs a function against an array element

const deposits = movements.filter(mov => mov > 0);
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/
/** 
// MAP Array Method
// Performs function against all elements in an array
const eurToUsd = 1.1;

const movementsUSD = movements.map(mov => mov * eurToUsd);
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
console.log(movements);
console.log(movementsUSD);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);

const user = 'Steven Thomas Williams'; //stw
const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');

console.log(username);
*/
/* 
///////////////////////////////////////
// Coding Challenge #1


Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. 

A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/** 
const julia1 = [3, 5, 2, 12, 7];
const julia2 = [9, 16, 6, 8, 3];
const kate1 = [4, 1, 15, 8, 3];
const kate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  // 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
  const newJuliaDogs = dogsJulia.slice(1, -2);

  // Jonas ANSWER
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);

  // 2. Create an array with both Julia's (corrected) and Kate's data
  const allDogs = [...newJuliaDogs, ...dogsKate];

  // Jonas ANSWER
  const dogs = dogsJuliaCorrected.concat(dogsKate);

  // 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")

  allDogs.forEach(function (v, i, a) {
    console.log(
      `Dog number ${i + 1} is ${
        v < 3 ? 'still a puppy 🐶' : 'an adult, and is ' + v + ' years old'
      }`
    );
  });

  // Jonas ANSWER
  console.log('---- JONAS ----');
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });

  // 4. Run the function for both test datasets
};

checkDogs(julia1, kate1);
checkDogs(julia2, kate2);
*/
/** 
// Using FOREACH on MAPS and SETS

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// same parameters as other forEach callback functions for consistency, HOWEVER
// key will be the same value as value because a set doesn't have keys or indexes
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
*/

/** 
// USING FOREACH on ARRAYS
for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

console.log('------- FOREACH -------');
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
});

// What if we needed the index counter?
console.log('------ Counters -------');
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('------- FOREACH -------');
// order of arguments matters
movements.forEach(function (mov, i, array) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
*/
/**
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE - DOES NOT mutate original array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE - Mutates original array
console.log(arr.splice(2)); // returns removed
console.log(arr); // removed spliced elements from original array
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.splice(-1)); // remove last element from array
console.log(arr);

arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.splice(1, 2));
console.log(arr);

// REVERSE - mutates original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2);
console.log(arr2.reverse());
console.log(arr2);

// CONCAT -- does not mutate original array
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN -- does not mutate original array
console.log(letters.join(' - '));

// AT -- Does not mutate original array
const atArr = [23, 11, 64];
console.log(atArr[0]); // returns value at position 0
console.log(atArr.at(0)); // returns value at position 0

console.log(atArr[atArr.length - 1]);
console.log(atArr.slice(-1)[0]);
console.log(atArr.at(-1)); // easier way to pull last element from array

// AT also works on string
console.log('Hello'.at(0)); // H
console.log('Hello'.at(1)); // e
*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. for each dog, calculate the recommended food portion and add it to the object as a new property: recommendedFood = weight ** 0.75 * 28
dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little

dogs.forEach(dog => {
  dog.eatsTooMuch = dog.curFood > dog.recommendedFood * 1.1;
  dog.eatsTooLittle = dog.curFood < dog.recommendedFood * 0.9;
});

const eatingHabit = function (owner, dog) {
  console.log(dog.eatsTooLittle, dog.eatsTooMuch, owner, dog);
  if (dog.eatsTooMuch) {
    console.log(`${owner}'s dog is eating too much!`);
  } else if (dog.eatsTooLittle) {
    console.log(`${owner}'s dog is eating too little!`);
  } else {
    console.log(`${owner}'s dog is eating just right!`);
  }
};
const owner = 'Sarah';

eatingHabit(owner, ...dogs.filter(dog => dog.owners.includes(owner)));

// ANSWER
const dogsSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    dogsSarah.curFood > dogsSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

const ownersEatTooMuch = dogs.filter(dog => dog.eatsTooMuch === true);
const ownersEatTooLittle = dogs.filter(dog => dog.eatsTooLittle === true);
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// ANSWER
const ownersEatTooMuchAns = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
const ownersEatTooLittleAns = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittleAns, ownersEatTooMuchAns);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

ownersEatTooMuch.forEach(dog => {
  console.log(`${dog.owners.join(' and ')}'s dogs eat too much!`);
});

ownersEatTooLittle.forEach(dog => {
  console.log(`${dog.owners.join(' and ')}'s dogs eat too little!`);
});

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)

console.log(
  dogs.filter(dog => {
    if (dog.curFood === dog.recommendedFood) return dog;
  }).length > 0
);

// ANSWER
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)

console.log(
  dogs.filter(dog => {
    if (!dog.eatsTooLittle && !dog.eatsTooMuch) return dog;
  }).length > 0
);

// ANSWER
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

const goodEatingDogs = dogs.filter(dog => {
  if (!dog.eatsTooLittle && !dog.eatsTooMuch) return dog;
});
console.log(goodEatingDogs);

// ANSWER

const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(checkEatingOkay));

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const sortedDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortedDogs);
