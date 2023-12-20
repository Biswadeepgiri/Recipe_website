const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //for doing all the files public for accessing like ./images/img1.jpg etc.
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());


app.set('layout', './layouts/main');
app.set('view engine', 'ejs');//to set the view engine to ejs



const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes); //all middlewares will use the routes defined above.

app.listen(port, () => console.log(`Listening to port ${port}`));
