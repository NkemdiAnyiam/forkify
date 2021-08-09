'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { wait } from './helpers.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) { return; }

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage(1));

    // 1) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);
  
    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) { return; }

    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  }
  catch(err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  //recipeView.render(model.state.recipe); // works, but causes the ENTIRE recipe view to be rerendered
  recipeView.update(model.state.recipe); // only updates text and attributes in the DOM
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) { model.addBookmark(model.state.recipe); }
  else { model.deleteBookmark(model.state.recipe.id); }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  // Upload new recipe data
  try {
    throw new Error('Uploads disabled. To add recipes, please build your own version and use your own API key https://github.com/NkemdiAnyiam/forkify');

    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change hash in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  }
  catch(err) {
    console.error('😢', err);
    addRecipeView.renderError(err.message);
  }

  // Reset form window
  await wait(MODAL_CLOSE_SEC);
  addRecipeView.render({});
}

const init = function () {
  model.restoreBookmarks();
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);
  
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
