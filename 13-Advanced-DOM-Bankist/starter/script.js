'use strict';

///////////////////////////////////////
// Globals

// modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// header
const header = document.querySelector('.header'); // header we will make sticky
// nav
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect(); // needed to know height of sticky nav
// operations
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
// sections
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
// images
const imgTargets = document.querySelectorAll('img[data-src]'); // img with property "data-src"
// slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnSlideLeft = document.querySelector('.slider__btn--left');
const btnSlideRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Global Functions

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll X/Y', window.scrollX, window.scrollY); // gets current scroll position of page
  // console.log(
  //   'height/width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // gets current browser window area size (viewport)

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX, // current position + current window scroll
  //   top: s1coords.top + window.scrollY, // current position + current window scroll
  //   behavior: 'smooth',
  // });
  // REPLACED BY:
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

// this is not a scalable approach because it adds the exact same function to every element
// use event delegation instead
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // section1.scrollIntoView({ behavior: 'smooth' });
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Top Nav Links
// event delegation -- add event listener to common parent element, then use target to determine what was clicked
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy: identifying what was clicked is what we use for nav
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Operations Tabs
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause, instead of if(clicked){} -- cleaner more modern approach
  if (!clicked) return;

  // select clicked tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // active clicked content
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // argument from bind turns into "this"
    });
    logo.style.opacity = this; // argument from bind turns into "this"
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5)); // bind allows passing in argument to handler function
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// observer callback function
const stickyNav = function (entries) {
  const [entry] = entries; // entries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// create observer
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

// Reveal Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //remove because we are not hiding again
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// allSections.forEach(function (section) {
//   sectionObserver.observe(section);
//   section.classList.add('section--hidden');
// });

// Lazy Load Images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // show full-res image
  entry.target.src = entry.target.dataset.src;
  // remove blurry filter css after completion of the load event so it doesn't show lazy img before loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target); // once loaded we don't need observer anymore
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //trigger loading prior to display
});

imgTargets.forEach(img => imgObserver.observe(img));

// Section Content Slider
let curSlide = 0;
const maxSlides = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlides - 1) curSlide = 0;
  else curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlides - 1;
  else curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
};

// Dot Functionality

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
  activateDot(0);
};

// Dot Event Listeners
btnSlideRight.addEventListener('click', nextSlide);
btnSlideLeft.addEventListener('click', prevSlide);

// add keypress event handler
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset; // use of object destructuring
    goToSlide(slide);
    activateDot(slide);
  }
});

const initSlider = function () {
  goToSlide(0); // set it to slide 0 to start
  createDots();
};
initSlider();

////////////////////////////////////////////////////
/// LECTURE PRACTICE AREA
////////////////////////////////////////////////////

// Async & Defer

/** 
// DO NOT need to worry about this since the script tag is at the bottom of the HTML content
// document.ready would be an equivalent in react
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed, DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// called when user reloads or leaves site
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log('User is leaving page', e);
//   e.returnValue = '';
// });
*/
/** 

// Creating Observers
const obsCallback = function (entries, observer) {
  // when target options is intersecting the viewport (at 10%)
  entries.forEach(entry => {
    console.log(entry.intersectionRatio, entry.isIntersecting);
  });
};
const obsOptions = {
  root: null, // entire visible portion of page (viewport)
  //threshold can be a single digit or array of thresholds
  threshold: [0, 0.2], // 20% -- entry.intersectionRatio (% of entry visible within root)
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/
/** 
// DOM traversal
const h1 = document.querySelector('h1');

// go downward: child
console.log(h1.querySelectorAll('.highlight')); // doesn't matter how deep within DOM tree
console.log(h1.childNodes);
console.log(h1.children); // direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// go upwards: parents
console.log(h1.parentNode); // direct parent
console.log(h1.parentElement); // direct parent
h1.closest('.header').style.background = 'var(--gradient-secondary)'; // selects closest parent element with .header class

h1.closest('h1').style.background = '#9f9'; // will select itself as it is closest h1

// go sideways: siblings

console.log(h1.previousElementSibling); // null since this is top element
console.log(h1.nextElementSibling); // h4 eleemnt that follows h1

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // gets all siblings (and itself)
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) { // skip the current element
    el.style.transform = 'scale(0.5)';
  }
});
*/
/** 
// rgb(255,255,255);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// bubbling up example of event listeners
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // e.target is the same across event handlers
  // e.currentTarget will reflect the current element of event handler being triggered
  console.log('LINK', e.target, e.currentTarget);
  e.stopPropagation(); // will stop propagation of events from bubbling up (not great idea though)
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINKS', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
); // last argument tells whether to listen on capture (down) or bubbling (up) phase false (default): up, true: down
*/
/** 
const h1 = document.querySelector('h1');

// MDN Events
// older way of doing it
// h1.onmouseenter = function (e) {
//   // on mouse rollover of element
//   alert('addEventListener: Great!');
// };

// modern way -- allows adding (and removing) multiple events on an element
const alertH1 = function (e) {
  // on mouse rollover of element
  alert('addEventListener: Great!');

  h1.removeEventListener('mouseenter', alertH1); // will only execute once and then remove the event listener
};

h1.addEventListener('mouseenter', alertH1);

*/

/** 
console.log(document.head);
console.log(document.body);
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // HTML Collection (live reflection of page)
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // HTML Collection (live reflection of page)

// Creating and inserting elements
// .insertAdjacentHTML --> inserts HTML into document

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'This website uses cookies for improved functionality and analytics.';
message.innerHTML =
  'This website uses cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // inserts it before other elements in the head
// header.before(message);
// header.after(message);
header.append(message); // inserts it after the last element (moved it)

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //newer method
  });

// Styles

// Manually setting style attributes
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.width); // will return 120% because it was set in the element inline style
console.log(getComputedStyle(message)); // returns all the properties of the computed style
console.log(getComputedStyle(message).height); // returns just the height

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered'); // sets style defined in css properties

const logo = document.querySelector('.nav__logo');
console.log(logo.src); // reference standard properties on an element
console.log(logo.alt);
console.log(logo.className); // className instead of just class

logo.alt = 'Cool minimalist logo';
logo.setAttribute('company', 'Bankist'); // use to set custom attributes
console.log(logo.getAttribute('company')); // use to retreive custom attributes

console.log(logo.src); // absolute URL
console.log(logo.getAttribute('src')); // relative URL

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // absolute URL
console.log(link.getAttribute('href')); // relative URL

// Data attributes
console.log(logo.dataset.versionNumber); //"data-version-number" attribute on element

// Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use
//logo.className = 'jonas'; // overwrites all other classes
*/
