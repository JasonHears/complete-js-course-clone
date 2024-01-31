import * as model from './model.js';
import { MODAL_CLOSE_SECONDS, MIN_TITLE_LENGTH } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // transpiling backwards support
import 'regenerator-runtime/runtime'; // polyfill async await

const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // get has of URL

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. update bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // 2. Load Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 3. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load results
    await model.loadSearchResults(query);

    // 3) Render search results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (gotoPage) {
  // 1) Render search results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 2) Render pagination
  paginationView.render(model.state.search);
};

controlServings = function (newServings) {
  // updates recipe servings (in state)
  model.updateServings(newServings);
  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // update bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

validateRecipeForm = async function (recipe) {
  try {
    console.log('Recipe Validation', recipe);
    const errors = [];

    if (!Number.isFinite(+recipe.cookingTime)) {
      errors.push(`• Cooking Time should be a number.`);
    }

    if (!Number.isFinite(+recipe.servings) || +recipe.servings < 1) {
      errors.push(`• Servings should be a number greater than zero.`);
    }

    if (!recipe.image.startsWith('http')) {
      errors.push(`• Image should be a valid URL starting with http.`);
    }

    if (!recipe.sourceUrl.startsWith('http')) {
      errors.push(`• Source should be a valid URL starting with http.`);
    }
    Object.entries(recipe)
      .filter(el => el[0].startsWith('ingredient'))
      .forEach(ing => {
        if (ing[1] !== '' && ing[1].split(',').length !== 3) {
          errors.push(
            `• ${ing[0]} should be in format: quantity, unit, ingredient.`
          );
        }
      });

    if (recipe.title.length < MIN_TITLE_LENGTH) {
      errors.push(`• Title should be at least 3 characters in length.`);
    }

    if (errors.length > 0) {
      throw new Error(`Please fix the following errors: ${errors.join(' ')}`);
    }
  } catch (error) {
    throw error;
  }
};

controlAddRecipe = async function (newRecipe) {
  try {
    // validate Recipe form
    await validateRecipeForm(newRecipe);

    // show loading spinner
    addRecipeView.renderSpinner();

    // upload recipe data
    await model.uploadRecipe(newRecipe);

    // render recipeView
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    // update URL hash to new ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes); // publisher-subscriber model
  recipeView.addHanlderUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
