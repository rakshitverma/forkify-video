import 'core-js/actual';
import recipeView from './views/recipeView.js';
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
if (module.hot) {
  module.hot.accept();
}

import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1) Loading recipe

    await model.loadRecipe(id);

    ////2)Rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSeachResults = async function () {
  try {
    const query = searchView.getQuery();
    resultsView.renderSpinner();
    if (!query) return;
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    searchView.clearInput();
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlServings = function (newServings) {
  //Update the recipe serving in state
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  searchView.clearInput();
  paginationView.render(model.state.search);
};
// controlSeachResults();
const controlAddBookmark = function () {
  //Add bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //Update bookmarks View
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSeachResults);
  paginationView.addHandlerClick(controlPagination);
  console.log('Welcome');
};

init();

// test-fraction.js
import { Fraction } from 'fractional';

const testFraction = new Fraction(1, 2);
console.log(testFraction.toString()); // Should output "1/2"

const testFractionFromString = new Fraction('1 1/2');
console.log(testFractionFromString.toString()); // Should output "3/2"
