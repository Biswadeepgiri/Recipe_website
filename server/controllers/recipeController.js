
require('../models/database');
const { request } = require('express');
const Category = require('../models/Category');
const Recipe = require("../models/Recipe");
/**
 * Get /
 * Homepage
 */


//creating a controller for displaying the homepage
exports.homepage = async (req, res) => {
    try {
        const categorieslimit = 5;
        //finding the only 5 categories from the categories database
        const categories = await Category.find({}).limit(categorieslimit);
        //finding the latest 5 recipes from the recipe daabase
        const latestRecipes = await Recipe.find({}).sort({ _id: -1 }).limit(categorieslimit);


        const indian = await Recipe.find({ 'category': "Indian" }).limit(categorieslimit);
        const american = await Recipe.find({ 'category': "American" }).limit(categorieslimit);
        const chinese = await Recipe.find({ 'category': "Chinese" }).limit(categorieslimit);
        const thai = await Recipe.find({ 'category': "Thai" }).limit(categorieslimit);
        const food = { latestRecipes, indian, american, chinese, thai };


        res.render('index', { title: "Recipe App - Homepage", categories, food });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error Occured" });
    }
}
// creating a controller for displaying all the categories of the recipes
exports.exploreCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.render('categories', { title: "Recipe App - Categories", categories });

    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error Occured " });
    }
}


// creating a controller for displaying the detailed view of each recipe using its unique id

exports.exploreRecipe = async (req, res) => {
    try {
        const recipeid = req.params.id;

        const recipe = await Recipe.findById(recipeid);

        res.render('recipe', { title: "Recipe App - Recipe", recipe });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error occured while displaying the recipe" })
    }
}

// creating a controller for displaying the recipes of a particular category
exports.exploreIndividualCategory = async (req, res) => {
    try {

        const category_id = req.params.id;

        const category_recipes = await Recipe.find({ 'category': category_id });

        res.render('individual_category', { title: `Recipe App - ${category_id} Recipes `, category_recipes, category_id });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error occured while displaying the recipes of this category" });
    }
}

// searching for recipes using the post route and the 

exports.searchRecipes = async (req, res) => {
    try {

        const searchTerm = req.body.searchTerm;
        const searchedrecipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        // res.json(searchedrecipe);
        res.render('search', { title: "Recipe App - Search", searchedrecipe });

    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error occured while rendering the search page" });
    }
}

//controller for displaying the latest recipes to the user

exports.exploreLatest = async (req, res) => {
    try {
        const limitnumber = 20;
        const latestrecipes = await Recipe.find({}).sort({ _id: -1 }).limit(limitnumber);
        res.render('explore-latest', { title: '"Recipe App - Explore Latest', latestrecipes });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "An Error occured while displaying the latest recipes" });
    }
}

// controller for displaying a random recipe to the user

exports.exploreRandom = async (req, res) => {
    try {

        const countrecipes = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * countrecipes);
        let randomrecipe = await Recipe.findOne().skip(random).exec();
        // res.json(randomrecipe);
        let recipe = randomrecipe;
        // I amreding the random recipe using the individual recipe page that i created to enhance the reusability of the code
        res.render('recipe', { title: "Recipe App - Random Recipe", recipe });

    }
    catch (error) {

        res.status(500).send({ message: error.message || "An Error occured " });

    }
}

// controller for submitting a new recipe and displaying the submit-recipe page
// GET ROUTE //

exports.submitRecipe = async (req, res) => {

    // creating the flash objects

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');



    res.render('submit-recipe', { title: "Recipe App - Submit Recipe", infoErrorsObj, infoSubmitObj });

}

//controller for handling the post part of submitting the recipes where it will be stored in the database 
// the user will be redirected to the homepage 
// POST ROUTE//

exports.submitRecipePost = async (req, res) => {
    try {

        // handling uploads of the imaages using the express-uploads package

        let imageUploadFile; //the uploaded image file
        let uploadPath; // the path of the uploaded image
        let newImageName; //the name of the uploaded image

        //handling the case when no files are uploaded for the image in the form
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("no files were uploaded");
        }
        else {

            imageUploadFile = req.files.image;   // take the image file from the req object
            newImageName = Date.now() + imageUploadFile.name;   // create a unique name of the file by combining the current date with the name of the uploaded image

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;  // specifying the path of the uploaded image

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err);  // if everythin is good then upload otherwise throw the error
                }
            });
        }


        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName

        });

        await newRecipe.save();

        //configuring the flash objects

        req.flash('infoSubmit', 'Recipe has been added.')
        res.redirect('/submit-recipe');

    }
    catch (error) {

        //configuring the flash object for the errors

        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');

    }
}

// controller for updating a recipe 

exports.updateRecipe = async (req, res) => {

    // creating the flash objects
    const recipeid = req.params.id;
    const recipe = await Recipe.findById(recipeid);

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');



    res.render('update-recipe', { title: "Recipe App - Update Recipe", infoErrorsObj, infoSubmitObj, recipeid, recipe });

}

exports.updateRecipeVal = async (req, res) => {
    try {
        let imageUploadFile; //the uploaded image file
        let uploadPath; // the path of the uploaded image
        let newImageName; //the name of the uploaded image

        //handling the case when no files are uploaded for the image in the form
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("no files were uploaded");
        }
        else {

            imageUploadFile = req.files.image;   // take the image file from the req object
            newImageName = Date.now() + imageUploadFile.name;   // create a unique name of the file by combining the current date with the name of the uploaded image

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;  // specifying the path of the uploaded image

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err);  // if everythin is good then upload otherwise throw the error
                }
            });
        }
        const recipeid = req.params.id;
        const newrecipename = req.body.name;
        const newemail = req.body.email;
        const newdescription = req.body.description;
        const newingredients = req.body.ingredients;
        const newcategory = req.body.category;
        const newimage = newimage;
        const updatedrecipe = await Recipe.findByIdAndUpdate({ _id: recipeid }, {
            name: newrecipename,
            email: newemail,
            description: newdescription,
            ingredients: newingredients,
            category: newcategory,
            image: newimage
        });

        res.send(updatedrecipe);
        // req.flash('infoSubmit', 'Recipe has been updated.')
        // res.redirect(`/recipe/${recipeid}`);


    }
    catch (error) {
        req.flash('infoErrors', error);
        res.redirect(`/update-recipe/${recipeid}`);
    }
}

// updateRecipe();

//controller to delete a recipe 

exports.deleteRecipe = async (req, res) => {
    try {
        const recipeid = req.params.id;
        await Recipe.deleteOne({ _id: recipeid });
        console.log("recipe was deleted");
        res.redirect(`/recipe/${recipeid}`);
    }
    catch (error) {
        console.log(error);
    }

}


// deleteRecipe();




// // function to insert some dummy categories data into the database

const dummyCategoryData = [
    {
        "name": "Thai",
        "image": "thai-food.jpg"
    },
    {
        "name": "American",
        "image": "american-food.jpg"
    }, {
        "name": "Chinese",
        "image": "chinese-food.jpg"
    }
    , {
        "name": "Mexican",
        "image": "mexican-food.jpg"
    },
    {
        "name": "Indian",
        "image": "indian-food.jpg"
    },
    {
        "name": "Spanish",
        "image": "spanish-food.jpg"
    }
]

const dummyRecipeData = [
    {
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@raddy.co.uk",
        "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
        ],
        "category": "American",
        "image": "southern-friend-chicken.jpg"
    },
    {
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@raddy.co.uk",
        "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
        ],
        "category": "American",
        "image": "southern-friend-chicken.jpg"
    },
]

// insertDummyCategoryData();
// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany(dummyCategoryData);
//     }
//     catch (error) {
//         console.log(error);

//     }
// }


//insert dummy recipes data into the database


// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany(dummyRecipeData);
//     }
//     catch (error) {
//         console.log(error);

//     }
// }

// insertDummyRecipeData();

