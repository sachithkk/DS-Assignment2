const mongoose                      = require('mongoose'); //get mongoose module
const Schema                        = mongoose.Schema; // create mongoose Schema.

// Create Product schema
var orderSchema = new Schema({
    name: { type:String, required:true},
    year: {type:String, required:true},
    month: {type:String, required: true},
    card: {type:String, required: true},
    price: {type: String,required: false},
    cvc: {type:Number, required:true}
});

// export model
module.exports = mongoose.model('Order', orderSchema);