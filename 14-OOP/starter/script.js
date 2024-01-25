'use strict';
// Classes

///////////////////////////////////////
// Coding Challenge #4

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. They experiment with chining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%

GOOD LUCK 😀
*/

class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed} km/h`);
    return this;
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

class EVCl extends CarCl {
  #charge;
  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }

  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    console.log(`Battery is now at ${this.#charge}%`);
    return this;
  }

  accelerate() {
    this.speed += 20;
    this.#charge -= 2;
    console.log(
      `${this.make} is now going ${this.speed} km/h with a charge of ${
        this.#charge
      }%.`
    );
    return this;
  }

  brake() {
    this.speed -= 7;
    this.#charge++;
    console.log(
      `${this.make} is now going ${this.speed} km/h with a charge of ${
        this.#charge
      }%`
    );
    return this;
  }
}

const rivian = new EVCl('Rivian', 120, 23);
console.log(rivian);

rivian
  .accelerate()
  .accelerate()
  .brake()
  .brake()
  .chargeBattery(70)
  .chargeBattery(99)
  .accelerate();

console.log(rivian.speedUS); // getter in parent class

/** 
// Encapsulation -- protected properties and methods
class Account {
  // Public Fields (instances)
  locale = navigator.language;

  // Private Fields (instances)
  #movements = [];
  #pin;

  // Static public fields
  static numKeys = 10;

  constructor(owner, currency, pin) {
    // Instance Properties
    this._owner = owner;
    this.currency = currency;
    this.#pin = pin;
    // Protected property uses naming convention _nameOfField
    this._numKeys = 5;

    console.log(`Thanks for opening an account, ${owner}.`);
  }

  // Protected Methods (just a naming convention)
  _approveLoan(val) {
    return true;
  }

  // Private Methods (instance)
  #approveLoan(val) {
    return val > 0;
  }

  // Public interface Methods

  getMovements() {
    return this.#movements;
  }

  deposit(val) {
    this.#movements.push(val);
    return this; // return this makes this function chainable
  }

  withdraw(val) {
    this.deposit(-val);
    return this;
  }

  // public get/set
  get owner() {
    return this._owner;
  }

  set owner(owner) {
    this._owner = owner;
  }

  requestLoan(val) {
    if (this.#approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan approved`);
    } else {
      console.log(`Loan not approved.`);
    }
    return this; // return this makes this function chainable
  }

  // Static Methods
  static helper() {
    console.log(`Account Helper!`);
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);
// acc1._movements.push(250); // not a good way
// acc1._movements.push(-120); // not a good way
acc1.deposit(250);
acc1.withdraw(120);
console.log(acc1);
console.log(acc1.pin);

acc1.requestLoan(1000);
console.log(acc1.getMovements());
Account.helper();
console.log(Account.numKeys);

// Chaining
acc1.deposit(300).deposit(500).withdraw(35).requestLoan(25000).withdraw(4000);
console.log(acc1);

// console.log(acc1.#movements); // JS error Private Field
*/
/** 
// Inheritance with Object.Create
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.birthName = firstName;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto);
console.log(steven);

const StudentProto = Object.create(PersonProto);
StudentProto.init = function (firstName, birthYear, course) {
  PersonProto.init.call(this, firstName, birthYear);
  this.course = course;
};

StudentProto.introduce = function () {
  console.log(`My name is ${this.fullName} and I study ${this.course}.`);
};

const jay = Object.create(StudentProto);
jay.init('Jay', 2010, 'Comp Sci');
jay.introduce();
jay.calcAge();
console.log(jay);
*/
/** 
// Class Inheritance - ES6 Classes

class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }

  // Instance Methods will be added to the prototype property
  calcAge() {
    // creates prototypal inheritance
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.firstName}!`);
  }

  get age() {
    return 2037 - this.birthYear;
  }

  // Set a property that already exists
  set fullName(name) {
    if (name.includes(' ')) this._fullName = name;
    else console.log(`${name} is not a full name.`);
  }

  get fullName() {
    return this._fullName;
  }

  // static method called against parent class
  static hey() {
    console.log('Hey there!', this);
  }
}

class StudentCl extends PersonCl {
  constructor(fullName, birthYear, course) {
    // needs to happen first! Creates this keyword
    super(fullName, birthYear); // parent class constructor method
    this.course = course;
  }

  introduce() {
    console.log(`My name is ${this.fullName} and I study ${this.course}.`);
  }

  calcAge() {
    console.log(
      `I'm ${2037 - this.birthYear} years old, but I feel more like I'm ${
        2037 - this.birthYear + 10
      } years old.`
    );
  }
}

const jonas = new StudentCl('Jonas Jones', 2002, 'Comp Sci');
console.log(jonas);
jonas.introduce();
jonas.calcAge();
*/

/* 
///////////////////////////////////////
// Coding Challenge #3

1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
2. Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo';
3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%

GOOD LUCK 😀


const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is now going ${this.speed} km/h.`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is now going ${this.speed} km/h.`);
};

const EVCar = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};
EVCar.prototype = Object.create(Car.prototype); // link new prototype object to Car
EVCar.prototype.constructor = EVCar; // set to correct constructor

EVCar.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EVCar.prototype.accelerate = function () {
  this.speed += 20;
  this.charge -= 2;
  console.log(
    `${this.make} is now going ${this.speed} km/h with a charge of ${this.charge}%.`
  );
};
EVCar.prototype.brake = function () {
  this.speed -= 7;
  this.charge++;
  console.log(
    `${this.make} is now going ${this.speed} km/h with a charge of ${this.charge}%`
  );
};

const tesla = new EVCar('Tesla', 120, 23);
console.log(tesla);

tesla.chargeBattery(90);
console.log(tesla);

tesla.accelerate();
tesla.accelerate();
tesla.accelerate();
tesla.brake();

console.log(tesla.__proto__);
*/
/** 

const Person = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
};

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

// Creating a Child Class with Inheritance from a Parent Class
const Student = function (firstName, birthYear, course) {
  Person.call(this, firstName, birthYear); // call the Person constructor passing in this
  this.course = course;
};
// Linking of prototypes between Student and Person
Student.prototype = Object.create(Person.prototype); // create new prototype object linked to Person prototype
Student.prototype.constructor = Student; // set to correct constructor

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const mike = new Student('Mike', 2020, 'Computer Sci');
mike.introduce();
mike.calcAge();
console.log(mike);
console.dir(Student.prototype.constructor);
*/
/* 

///////////////////////////////////////
// Coding Challenge #2

1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h

GOOD LUCK 😀


class Car {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going ${this.speed} kph`);
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going ${this.speed} kpt`);
  }

  get speedUS() {
    console.log(`${this.make} is going ${this.speed / 1.6} mph`);
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

const ford = new Car('Ford', 120);

ford.speedUS;
ford.accelerate();
ford.speedUS;
ford.brake();
ford.speedUS;
ford.accelerate();
ford.speedUS;
ford.speedUS = 100;
ford.speedUS;
*/
/** 
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.birthName = firstName;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto);
console.log(steven);
steven.name = 'Steven';
steven.birthYear = 2002;
steven.calcAge();
console.log(steven); // calcAge is in the prototype of steven

const sarah = Object.create(PersonProto);
sarah.init('Sarah', 1996);
sarah.calcAge();
*/
/** 
const account = {
  owner: 'jonas',
  movements: [200, 530, 120, 300],

  get latest() {
    return this.movements.slice(-1).pop();
  },

  set latest(mov) {
    this.movements.push(mov);
  },
};
console.log(account.latest);

account.latest = 50;
console.log(account.movements);

// Class Expression
// const PersonCLe = class {}

// Class Declaration
class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }

  // Instance Methods will be added to the prototype property
  calcAge() {
    // creates prototypal inheritance
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.firstName}!`);
  }

  get age() {
    return 2037 - this.birthYear;
  }

  // Set a property that already exists
  set fullName(name) {
    if (name.includes(' ')) this._fullName = name;
    else console.log(`${name} is not a full name.`);
  }

  get fullName() {
    return this._fullName;
  }

  // static method called against parent class
  static hey() {
    console.log('Hey there!', this);
  }
}

PersonCl.hey();
// jessica.hey(); // would cause a JS error as not a function (available to instance)

const jessica = new PersonCl('Jessica Davis', 1996);

console.log(jessica);

jessica.calcAge();
console.log(jessica.__proto__ === PersonCl.prototype);

// This still works
// PersonCl.prototype.greetPerson = function () {
//   console.log(`Hey ${this.firstName}!`);
// };
// jessica.greetPerson();
*/
/**
 */
/** 
///////////////////////////////////////
// Coding Challenge #1


1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h

GOOD LUCK 😀
*/
/** 

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is now going ${this.speed} km/h.`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is now going ${this.speed} km/h.`);
};

const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

bmw.accelerate();
bmw.accelerate();
bmw.brake();
mercedes.brake();
mercedes.brake();
mercedes.brake();
mercedes.brake();
mercedes.accelerate();
*/
/**
 *
 * Classes = Blueprint for creating new objects (ie User)
 * Instance = object created from a Class (ie User-> Jonas) (Instantiation)
 *
 * 4 Principles for OOP Classes
 * * Abstraction -- ignoring or hiding details that don't matter, only showing those that can be used
 * * Encapsulation -- Keep some properties and methods private, or only accessible through a public interface (API)
 * * Inheritance -- Child Class can inherit from Parent Class. Child Class can have their own properties and methods as well.
 * * Polymorphism -- A child class can overwrite a method inherited from a parent class.
 *
 * OOP in JS:
 *  * Prototypes -- Objects (Instances) can inherit from linked prototype object (Class) (Prototypal Inheritance)
 *  * Delegation -- Behavior is delegated to the prototype object (Class)
 *
 * Creation
 *  * Constructors -- Convention to capitalize first letter
 *     * Creation:
 *       1. New {} (empty object) is created
 *       2. function is called, this = {}
 *       3. {} is linked to prototyp
 *       4. function automatically returns constructed object {}
 *  * ES6 Classes
 *  * object.create()
 *
 */

/** 
// Constructor Functions

const Person = function (firstName, birthYear) {
  // instance properties
  this.firstName = firstName;
  this.birthYear = birthYear;

  // NEVER Add functions into a constructor function -- not scalable
  // this.calcAge = function() {
  //   console.log(2037 - this.birthYear);
  // }
};

const jonas = new Person('Jonas', 1991);
console.log(jonas);

const jason = new Person('Jason', 1975);
const aris = new Person('Aris', 1989);
console.log(jason);
console.log(aris);
console.log(jason.firstName);

console.log(jonas instanceof Person); // true

// Prototypes
console.log(Person.prototype);
Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};
console.log(jonas); // no calcAge method directly on jonas instance, only on prototype
jonas.calcAge();
jason.calcAge();
aris.calcAge();

console.log(jonas.__proto__); // prototype property of jonas instance
console.log(jonas.__proto__ === Person.prototype); // true -- prototype of constructor object will equal proto of each instance
console.log(jason.__proto__ === Person.prototype); // true
console.log(Person.prototype.isPrototypeOf(jonas)); // true -- prototypeOfLinkedObject

Person.prototype.species = 'Homo Sapiens'; // add property to Person prototype
console.log(jonas.species, jason.species, aris.species);

console.log(jonas.hasOwnProperty('firstName')); // true -- directly in jonas instance
console.log(jonas.hasOwnProperty('species')); // false -- in prototype

console.log(jonas.__proto__); // Person prototype
console.log(jonas.__proto__.__proto__); // Object prototype
console.log(jonas.__proto__.__proto__.__proto__); // null -- no parent

console.dir(Person.prototype.constructor); // will be Person constructor

const arr = [1, 2, 3, 4, 5, 5, 5, 4, 4, 3];
console.log(arr); // will include Array.prototype

// just for demo
// Array.prototype.unique = function () { // don't want to do this on JS objects
//   return [...new Set(this)];
// };
// console.log(arr.unique());
*/
