const mongoose                      = require('mongoose'); // get mongoose module.
const Schema                        = mongoose.Schema; // create mongoose Schema.

// Create Product schema
var productSchema = new Schema({
    imagePath: { type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required: true},
    price: {type: Number,required: true}
});

// export model
module.exports = mongoose.model('Product', productSchema);