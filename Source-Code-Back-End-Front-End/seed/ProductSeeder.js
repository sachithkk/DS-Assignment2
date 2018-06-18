const Product                           = require('../models/product');
const mongoose                          = require('mongoose');

// create database connection
mongoose.connect('mongodb://127.0.0.1:27017/OnlineFood', () => {
    if(err){
        console.log(err);
        process.exit(-1);
    }
    console.log("Database Connection Established");
});

/*  create new product
* */
var product = [

    new Product({
    imagePath: 'https://images.pexels.com/photos/8500/food-dinner-pasta-spaghetti-8500.jpg?cs=srgb&dl=basil-dinner-food-8500.jpg&fm=jpg',
    title: 'HOT CHILI CHICKEN NOODLES',
    description:'Extra hot Chinese noodles with classic Chinese ingredients and peppers',
    price: 350

    }),
    new Product({
        imagePath: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?cs=srgb&dl=chips-dinner-fast-food-70497.jpg&fm=jpg',
        title: 'SPICY CRISPY CHICKEN SANDWICH',
        description:'Spicy Crispy Chicken Burger made with juicy, tender and crispy 100% white meat chicken',
        price: 1200
    }),
    new Product({
        imagePath: 'https://images.pexels.com/photos/724216/pexels-photo-724216.jpeg?cs=srgb&dl=baked-beer-cheese-724216.jpg&fm=jpg',
        title: 'SPICY CHEESE CHICKEN PIZZA',
        description:'A spicy chicken pizza with a tomato base, mozzarella, chilli, onions and moshrooms',
        price: 1800
    })
];
// end of array

var done = 0;
for(var i=0; i< product.length; i++){
    // save data into database one by one
    product[i].save((err,result) => {
        done++;
        if(done === product.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
    console.log("Data Added Successfully");
}