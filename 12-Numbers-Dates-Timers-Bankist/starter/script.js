'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-01-23T21:31:17.178Z',
    '2024-01-22T17:42:02.383Z',
    '2024-01-21T09:15:04.904Z',
    '2024-01-18T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions

const formatMovementDate = function (date, locale, showDate = false) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  let displayDate = '';
  if (daysPassed === 0 && !showDate) {
    displayDate = `Today`;
  } else if (daysPassed === 1 && !showDate) {
    displayDate = `Yesterday`;
  } else if (daysPassed <= 7 && !showDate) {
    displayDate = `${daysPassed} days ago`;
  } else {
    // lingoes.net
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    displayDate = new Intl.DateTimeFormat(locale, options).format(date);
  }
  return displayDate;
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // clears out current contents of Movements container

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const displayDate = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCur(
        mov,
        acc.local,
        acc.currency
      )}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.local,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const inSum = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(inSum, acc.local, acc.currency)}`;

  const outSum = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${formatCur(outSum, acc.local, acc.currency)}`;

  const intSum = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${formatCur(
    intSum,
    acc.local,
    acc.currency
  )}`;
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
  displayMovements(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(time);
      resetUI();
    }
    time--;
  };
  let time = 300; // 5 minutes
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const resetUI = function () {
  const emptyAcc = {
    movements: [],
    movementsDates: [],
    interestRate: 0,
    locale: 'en-US',
    currency: 'USD',
  };
  labelWelcome.textContent = `Log in to get started`;
  updateUI(emptyAcc);
  containerApp.style.opacity = 0;
};

// Event Handlers
let currentAccount, timer;

// FAKE Always Logged In
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents the page from reloading on submit of form

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
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

    // start logout timer
    if (timer) clearInterval(timer); // clear timer if it already exists
    timer = startLogOutTimer();

    // disply account movement details
    updateUI(currentAccount);

    // update current date
    const displayDate = formatMovementDate(
      new Date(),
      currentAccount.locale,
      true
    );
    labelDate.textContent = `${displayDate}`;
  } else {
    alert('Invalid Login Details!');
    // hide content
    resetUI();
  }
});

// TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting and reloading page
  const amount = +inputTransferAmount.value;
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
    // move money between accounts
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // update display
    updateUI(currentAccount);
  } else {
    alert(`Invalid amount entered`);
  }
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`loan button clicked`);

  const loanAmt = Math.floor(+inputLoanAmount.value);

  if (
    loanAmt > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmt * 0.1)
  ) {
    console.log(`loan approved`);
    setTimeout(function () {
      currentAccount.movements.push(loanAmt);
      // add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
    }, 3000);
  } else {
    alert(`Loan not approved!`);
  }
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

let sorted = false;

// SORT
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
  btnSort.textContent = sorted ? 'NO SORT' : '↓ SORT';
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza with ${ing1} and ${ing2}! 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting....');

if (ingredients.includes('olives')) clearTimeout(pizzaTimer); // will cancel timer

// setInterval -- executes every interval

// setInterval(function () {
//   const now = new Date();
//   console.log(
//     new Intl.DateTimeFormat(navigator.languge, {
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     }).format(now)
//   );
// }, 1000);

// const num = 3884754.23;

// MDN Intl NumberFormat options
// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR',
//   useGrouping: true,
// };

// console.log(new Intl.NumberFormat('de-DE', options).format(num));
// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log(new Intl.NumberFormat('fr-FR', options).format(num));
// console.log(new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language).format(num)
// );

// Dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// calculates time between two dates
//const calcDaysPassed = (date1, date2) => date2 - date1;

// const days1 =
//   calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 24)) /
//   (1000 * 60 * 60 * 24);
// console.log(days1);
/*
const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2022 6:03:04'));
console.log(new Date('May 6, 1975'));
console.log(new Date(account1.movementsDates[0]));
// year, month, day, hour, minutes, seconds
console.log(new Date(2037, 10, 19, 15, 23, 5)); //month 10 = November (zero-based)
console.log(new Date(2037, 10, 32)); // will be Dec 2
console.log(new Date(0)); // Unix EPOC Time

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2142285780000)); // create date from timestamp
console.log(Date.now()); // current timestamp

future.setFullYear(2040); // set function too
future.setMonth(4); // May in zero-based months
future.setDate(6);
console.log(future);
*/

/** 
// remainder - modulo -- how much is left after dividing by a number
console.log(5 % 2); // 1
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3); // 2
console.log(8 / 3); // 8 = 2 * 3 + 2

// even vs odd

console.log(6 % 2); // 0 = even
console.log(6 / 2); // 6 = 2 * 3 + 0
console.log(7 % 2); // 1
console.log(7 / 2); // 7 = 2 * 3 + 1

const isEven = num => num % 2 === 0;

console.log(isEven(8));
console.log(isEven(11));

// separators -- _ is used as a comma would in written
// can only be placed between two numbers
const solarSystem = 287_460_000_000;
console.log(solarSystem);

// BigInt
// Numbers are 64 bits -- 53 bitts for number, remainder for other info
console.log(2 ** 53 - 1); // bigbest number JS can represent
console.log(Number.MAX_SAFE_INTEGER);

console.log(234234234298234828748247);
console.log(234234234298234828748247n);
console.log(BigInt(234234234298234828748247n));

console.log(10000n + 10000n);
const huge = 200000000000000000n;

console.log(20n === 20); // false -- one is bigint the other is number
console.log(typeof 20n);
//console.log(huge * 2); // errors -- cannot mix bigint and int

console.log(11n / 3n); // returns bigint 3n
*/
/** 
console.log(Math.sqrt(25)); // 2
console.log(25 ** (1 / 2)); // ** --> exponent operator: 25^1/2
console.log(8 ** (1 / 3)); // cubic root of 8 = 2

console.log(Math.max(5, 18, 31, 2, 19));
console.log(Math.min(5, 18, 31, 2, 19));

console.log(Math.PI);
console.log(Math.PI * Number.parseFloat('10px') ** 2); // area of a circle

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

let rolls = [];
for (let i = 0; i < 20; i++) {
  rolls.push(randomInt(1, 6));
}
console.log(rolls);

console.log(Math.trunc(23.3)); // remove decimal from number
console.log(Math.round(23.3)); // round to nearest int 23
console.log(Math.round(23.8)); // 24

console.log(Math.ceil(23.1)); // rounds up: 24
console.log(Math.floor(23.8)); // rounds down: 23

console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24 (rounds down)

console.log((2.7).toFixed(3)); // will return a string
console.log(+(2.7).toFixed(3)); // + will coerce it to a number
/** 
console.log(0.1 + 0.2); //0.3000000000004
console.log(0.1 + 0.2 === 0.3); // false

// these do the same thing due to type coercion
console.log(Number('23'));
console.log(+'23');

console.log(Number.parseInt('30px', 10)); // result: 30, "10" signifies base-10
console.log(Number.parseInt('e23', 10)); // NaN

console.log(Number.parseFloat('2.5rem')); //2.5 -- good for reading values from CSS
console.log(Number.parseInt('2.5rem')); //2

// works for validating if a number, except in divide by zero scenarios
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20X')); // true
console.log(Number.isNaN(3 / 0)); // false

// generally best to use to validate if a number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20X')); // false
console.log(Number.isFinite(3 / 0)); // false

console.log(Number.isInteger(20)); // true
console.log(Number.isInteger(20.5)); // false
console.log(Number.isInteger('20')); // false
console.log(Number.isInteger(+'20X')); // false
*/
