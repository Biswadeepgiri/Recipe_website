const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App routes of the webpage
 */
// route for the homepage of the app
router.get('/', recipeController.homepage);
// route for the categories page of the app
router.get('/categories', recipeController.exploreCategories);
// route for the recipe page of the app
router.get('/recipe/:id', recipeController.exploreRecipe);
// route for the pages to the individual categories
router.get('/categories/:id', recipeController.exploreIndividualCategory);
// post route to get the search 
router.post('/search', recipeController.searchRecipes);
// get route for getting the latest recipes
router.get('/explore-latest', recipeController.exploreLatest);
// get route for a random recipe
router.get('/random-recipe', recipeController.exploreRandom);
// route for submitting a new recipe
router.get('/submit-recipe', recipeController.submitRecipe);
//route for posting a new recipe
router.post('/submit-recipe', recipeController.submitRecipePost);
//route for updating a recipe by id getting the page
router.get('/update-recipe/:id', recipeController.updateRecipe);
//router for updating the information
router.put('/update-recipe/:id', recipeController.updateRecipeVal)
// //route for deleting a recipe by id

router.get('/delete-recipe/:id', recipeController.deleteRecipe);




module.exports = router;


