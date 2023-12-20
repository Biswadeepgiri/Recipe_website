// // // selecting the button which will add the ingredients
// // let addIngredientBtn = document.getElementById('addIngredientBtn');
// // // selecting the ingredientlist object
// // let ingredientlist = document.querySelector('.ingredientlist');
// // // selecting the ingredientdiv object
// // let ingredientdiv = document.querySelectorAll('.ingredientdiv')[0];

// // // onclick eventlistener on the button

// // addIngredientBtn.addEventListener('click', function () {
// //     let newIngredients = ingredientdiv.cloneNode(true);
// //     let input = newIngredients.getElementByTagName('input')[0];
// //     input.value = '';
// //     ingredientlist.appendChild(newIngredients);
// // });


// let addIngredientBtn = document.getElementById('addIngredientBtn');
// let ingredientList = document.querySelector('.ingredientList');
// let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];

// addIngredientBtn.addEventListener('click', function () {
//     let newIngredients = ingredeintDiv.cloneNode(true);
//     let input = newIngredients.getElementsByTagName('input')[0];
//     input.value = '';
//     ingredientList.appendChild(newIngredients);
// });

let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];

addIngredientsBtn.addEventListener('click', function () {
    let newIngredients = ingredeintDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredients);
});