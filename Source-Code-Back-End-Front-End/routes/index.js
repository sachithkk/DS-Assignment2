const Express                           = require('express'); // get express
const router                            = Express.Router();  // get Router() 
const Product                           = require('../models/product'); // get product Schema
const Cart                              = require('../models/cart'); //get cart Schema
const Order                             = require('../models/order'); // get order Schema
const nodemailer                        = require('nodemailer'); // get nodemail npm 
const mobilePaymentSchema               = require('../models/mobilePaymentUsers'); // get mobilePaymentSchema

/* home page */
router.get('/', function(req, res, next) {

    var successMsg = req.flash('success')[0];
    
    // get food from database and store that data inside the array and send data 
    Product.find((err, data) => {
        var productList = [];
        var size = 3;
        for(var i = 0; i< data.length; i += size){
            productList.push(data.slice(i, i + size));
        }
        res.render('shop/index', {title:'Shopping Cart', product:productList, successMsg:successMsg, noMessage: !successMsg})
    })

});


/* This get method do add food item in cart with matching url*/
router.get('/add-to-cart/:id', (req, res, next) => {

    var productid = req.params.id; // get food id as a parameter.
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    // find matching food is exists using findById query method.
    Product.findById(productid, (err, product) => {
        // if does not exist redirect home page.
       if(err){
           return res.redirect('/');
       }
       /* Food exist
         add food item into cart */
       cart.add(product, product.id);
       req.session.cart = cart;
       console.log(req.session.cart);
       res.redirect('/');
    });
});


router.get('/reduce/:id', function(req, res)  {
    var productid = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.removiItem(productid);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


router.get('/shopping-cart', (req, res) => {
    if(!req.session.cart){
        return res.render('shop/shoppingCart', {product:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shoppingCart', {product:cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/SMS', (req, res) => {
    res.render('user/sms');
});


router.get('/checkout', isLoggedIn , (req, res) => {

    /* This method check has a cart. if does not has it redirect given url*/
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkOut', {total:cart.totalPrice, errMsg, noError: !errMsg});
});

router.post('/checkout', (req, res) => {

    // Email layer out set using html, this html part store output variable.
    const output = `

        <p>QuickChef Food.Com</p>
        <h3>Order Details</h3>
        <ul>
            <li>Customer Name: ${req.body.name}</li>
            <li>Credit CardNumber: ${req.body.card}</li>
            <li>Grand Totala: ${req.body.price}</li>
            <li>Oder Date and time: ${new Date()}</li>
        </ul>

        <h3>Message</h3>
        <p>Your order successfully placed</p>
    
    `;

    // check cart is created or not.
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }

    //if cart is not created create new cart.
    var cart = new Cart(req.session.cart);

    // stripe api secret key
    var stripe = require("stripe")(
        "sk_test_i56TJ4YwDpaZMfwKXxtV962X"
    );


    stripe.charges.create({

        amount: cart.totalPrice * 100,
        currency: req.body.stripeToken,
        source: "tok_amex", // obtained with Stripe.js
        description: "Charge for madison.garcia@example.com"

    }, function(err, charge) {

        var order = new Order({
            name:req.body.name,
            year:req.body.year,
            month:req.body.month,
            card:req.body.card,
            prce:req.body.price,
            cvc:req.body.cvc
        });
        // save order details into mongoDB
        order.save( (err, result) => {
            // check error
            if(err){
                console.log(err);
            }

            // this is nodemailer implementation
            let transporter = nodemailer.createTransport({
                service: "Gmail", // service type
                auth: {
                    user: 'donlinefoodorder@gmail.com', // generated ethereal user
                    pass: '1234@comDS'  // generated ethereal password
                },
                tls:{
                    rejectUnauthorized:false
                }
            });

            let mailOptions = {
                from: '"Nodemailer Contact" <donlinefoodorder@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Online Order', // Subject line
                text: 'Your Order Successfully Placed', // plain text body
                html: output // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Message sent");

        });

            //*********************
            req.flash('success', 'Successfully Payed Please Check Yor Email');
            req.session.cart = null;
            return res.redirect('/');
        });

    });
});


router.get('/mobile-payment' , isLoggedIn , (req, res) => {

    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/mobileCheckout', {total:cart.totalPrice, errMsg, noError: !errMsg});

    //res.render('shop/mobileCheckout');
});

router.post('/mobile-checkout', (req, res) => {

    var mobileUser = new mobilePaymentSchema({
        name:req.body.name,
        email:req.body.email,
        totalPrice:req.body.total,
        Pnumber:req.body.number
    });

    mobileUser.save().then( () => {
        //res.send("Message");
        req.flash('success', 'Your order placed');
        req.session.cart = null;
        return res.redirect('/');
    }).catch((err) => {
        console.log("Err : "+err);
    });
});


module.exports = router;

function isLoggedIn(req, res, next){
    // This is a function include in passport.js, It check if a user is authenticated or not
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrL = '/checkout';
    res.redirect('/user/signin');
}