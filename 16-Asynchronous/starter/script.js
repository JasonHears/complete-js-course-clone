'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
countriesContainer.style.opacity = 1;

const renderCountry = function (data, className) {
  const currency = data.currencies[Object.keys(data.currencies)[0]];
  const language = data.languages[Object.keys(data.languages)[0]];
  const html = `
<article class="country ${className}">
<img class="country__img" src="${data.flags.png}" />
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(
    1
  )}M people</p>
  <p class="country__row"><span>🗣️</span>${language}</p>
  <p class="country__row"><span>💰</span>${currency.name}</p>
</div>
</article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getJSON = function (url, errMsg = 'Something went wrong!') {
  return fetch(url).then(response => {
    // check the ok field. If false, call failed and should be rejected
    if (!response.ok) throw new Error(errMsg);

    return response.json();
  });
};

// URL Change to: https://countries-api-836d.onrender.com/countries/

const wait = function (secs) {
  return new Promise(function (resolve) {
    setTimeout(resolve, secs * 1000);
  });
};

const imgElem = document.querySelector('.images');
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgElem.append(img);
      resolve(img);
    });

    // reject -- ANSWER
    img.addEventListener('error', function () {
      reject(new Error('Image not found!'));
    });
  });
};

///////////////////////////////////////
// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'parallel' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

const loadAll = async function (imgArr) {
  // const imgs = imgArr.map(img => {
  //   return createImage(img);
  // });
  // ANSWER -- use async await on createImage
  const imgs = imgArr.map(async img => await createImage(img));
  console.log(imgs);

  // const allImgs = Promise.all(imgs);

  // ANSWER -- needed to add await!!
  const allImgs = await Promise.all(imgs);
  console.log(allImgs);
  allImgs.forEach(img => img.classList.add('parallel'));
};

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);

const loadNPause = async function (imgPath) {
  try {
    let img = await createImage(imgPath);
    await wait(2);
    img.style.display = 'none';
    await wait(2);
    img = await createImage('img/img-2.jpg');
    await wait(2);
    img.style.display = 'none';
  } catch (error) {
    console.error(error.message);
  }
};
// loadNPause('img/img-1.jpg');

/**


// ASYNC Functions
// awaits pauses execution until execution completes

const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error('Problem loading country based on geo');

    const dataGeo = await resGeo.json();

    // Get Country Data

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Unable to load country data!');

    const data = await res.json();
    renderCountry(data[0]);
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    renderError(`Something Happened 🤬: ${err.message}`);

    // Reject promise returned from async (support for promises)
    throw err;
  }
};

 

// const city = whereAmI();
// console.log(city);

// Mixing new (async) and old (promises) -- should generally be avoided!!
// whereAmI()
//   .then(city => console.log(city))
//   .catch(err => console.error(err.message))
//   .finally(() => console.log('Done!'));

// IEFE -- using async await
// (async function () {
//   console.log('Immediately Executed');
//   try {
//     const city = await whereAmI();
//     console.log(`IEFE Success: ${city}`);
//   } catch (err) {
//     console.log(`IEFE Error: ${err.message}`);
//   }
//   console.log('Done!');
// })();

// Using Promise.all() Combinator -- receives array of promises and returns a single promise
// Executes multiple promises in parallel

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    // console.log([data1.capital, data2.capital, data3.capital]);
    console.log(data.map(d => d[0].capital[0]));
  } catch (err) {
    console.log(err);
  }
};
// get3Countries('portugal', 'canada', 'tanzania');

// Promise.race -- receives array of promises and returns a single promise

// (async function () {
//   const res = await Promise.race([
//     getJSON(`https://restcountries.com/v3.1/name/italy`),
//     getJSON(`https://restcountries.com/v3.1/name/egypt`),
//     getJSON(`https://restcountries.com/v3.1/name/mexico`),
//   ]);
//   console.log(res[0]);
// })();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Took too long'));
    }, sec * 1000);
  });
};

// returns only the promise that finishes first
Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/italy`),
  getJSON(`https://restcountries.com/v3.1/name/egypt`),
  timeout(0.2),
])
  .then(res => console.log(res[0].name))
  .catch(err => console.log(err));

// Promise.allSettled -- returns all completed promises (regardless of status)
Promise.allSettled([
  Promise.resolve('A Success'),
  Promise.reject('A error'),
  Promise.resolve('A 2nd Success'),
]).then(res => console.log(res));

// Promise.all -- returns error if it occurs, otherwise all resolved promises
Promise.all([
  Promise.resolve('B Success'),
  Promise.reject('B error'),
  Promise.resolve('B 2nd Success'),
])
  .then(res => console.log(res))
  .catch(err => console.log(err));

// Promise.any -- returns first resolved promise (similar to race)
Promise.any([
  Promise.resolve('C Success'),
  Promise.reject('C error'),
  Promise.resolve('C 2nd Success'),
])
  .then(res => console.log(res))
  .catch(err => console.log(err));
*/
/* 
///////////////////////////////////////
// Coding Challenge #2

Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. 

When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. 

In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;

4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image

(HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);

5. After the second image has loaded, pause execution for 2 seconds again;

6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀


const imgElem = document.querySelector('.images');

const wait = function (secs) {
  return new Promise(function (resolve) {
    setTimeout(resolve, secs * 1000);
  });
};

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgElem.append(img);
      resolve(img);
    });

    // reject -- ANSWER
    img.addEventListener('error', function () {
      reject(new Error('Image not found!'));
    });
  });
};

createImage('img/img-1.jpg')
  .then(img => {
    console.log('Image 1 loaded');
    return wait(2).then(() => {
      img.style.display = 'none';
    });
  })
  .then(() => {
    return wait(2).then(() => {
      return createImage('img/img-2.jpg');
    });
  })
  .then(img => {
    console.log('Image 2 loaded');
    wait(2).then(() => {
      img.style.display = 'none';
    });
  })
  .catch(err => console.log(err));

// ANSWER
// let currentImg;

// createImage('img/img-1.jpg')
//   .then(img => {
//     console.log('IMAGE 1 LOADED');
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     console.log('IMAGE 2 LOADED');
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.error(err));

///////////////////////////////////////
*/
/**
 *
 *





// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   err => console.log(err)
// );

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      console.log(lat, lng);
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.city.slice(0, 9) === 'Throttled') throw new Error('Throttled!');

      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.com/v3.1/alpha/${data.prov}`);
    })
    .then(res => res.json())
    .then(data => {
      renderCountry(data[0]);
    })
    .catch(err => {
      console.error(`Error: ${err.message} 🐞💥`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', whereAmI);

// getPosition().then(res => console.log(res));
 */
/**
 * 
 * Promises
 
const lotteryPromise = new Promise(function (resolve, reject) {
  // executor function

  console.log('Lottery Draw is happening! 📢');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      // happy path
      resolve('You WIN! 🎉');
    } else {
      // sad path
      reject(new Error('You lost... 😭'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Pomise-ifying setTimeout function
const wait = function (secs) {
  return new Promise(function (resolve) {
    setTimeout(resolve, secs * 1000);
  });
};

wait(3)
  .then(() => {
    console.log('I waited 3 secons');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 secon'));

Promise.resolve('resolved immediately').then(x => console.log(x));
Promise.reject('rejected immediately').catch(err => console.log(err));
*/

/**
 * This is the old way --- XMLHttpRequest()

function getCountryAndNeighbor(country) {
  // XML HTTP Request -- old way of doing this
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    // what to do once data is loaded from web API
    renderCountry(data);

    data.borders?.forEach(function (neighbor) {
      console.log(neighbor);
      const request = new XMLHttpRequest();
      request.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
      request.send();

      request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        renderCountry(data, 'neighbour');
      });
    });
  });
}


// getting neighbors of neighbors of neights === CALLBACK HELL
*/

/** 
// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// request.send();

// const getCountryData = function (country) {
//   const request = fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json(); // need to make this call to return data -- returns promise
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

// data.borders?.forEach(function (neighbor) {
//   console.log(neighbor);
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data, 'neighbour');
//   });
// });
*/

/** 
const getJSON = function (url, errMsg = 'Something went wrong!') {
  return fetch(url).then(response => {
    // check the ok field. If false, call failed and should be rejected
    if (!response.ok) throw new Error(errMsg);

    return response.json();
  });
};

// Using fetch() function
const getCountryData = function (country) {
  // fetch(`https://restcountries.com/v3.1/name/${country}`)
  //   // need to make this call to return data -- returns promise
  //   .then(response => {
  //     // check the ok field. If false, call failed and should be rejected
  //     if (!response.ok) throw new Error('Country not found!');

  //     return response.json();
  //   })
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found!'
  )
    // do something with the returned data
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders?.[0];

      if (!neighbor) throw new Error('Neighbors not found!');

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        'Country not found!'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(err);
      renderError(err.message);
    })
    .finally(() => {
      // always called at the end of a chain
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function (e) {
  getCountryData('portugal');
});

// getCountryData('australia');
// getCountryData('usa');
// getCountryData('brazil');
// getCountryData('germany');


*/

//////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

/** 
// https://geocode.xyz/51.50354,-0.12768

const getSomeJSON = function (url, errMsg = 'Something broke!') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(errMsg);
    return response.json();
  });
};

const whereAmI = function (lat, lng) {
  getSomeJSON(`https://geocode.xyz/${lat},${lng}?geoit=json`, 'Invalid Data')
    .then(data => {
      if (data.city.slice(0, 9) === 'Throttled') throw new Error('Throttled!');

      console.log(`You are in ${data.city}, ${data.country}`);

      return getSomeJSON(
        `https://restcountries.com/v3.1/alpha/${data.prov}`,
        'Country not found!'
      );
    })
    .then(data => {
      renderCountry(data[0]);
    })
    .catch(err => {
      console.error(`Error: ${err.message} 🐞💥`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

whereAmI('52.508', '13.381');
whereAmI('19.037', '72.873');
whereAmI('-33.933', '18.474');

*/
