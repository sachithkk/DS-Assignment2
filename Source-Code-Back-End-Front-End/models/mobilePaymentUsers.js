const Mongoose          = require("mongoose");
const Schema            = Mongoose.Schema;

const mobileUser = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    totalPrice:{type:String, require:true},
    Pnumber:{type:String, required:true}
});

module.exports = Mongoose.model('mobilePayment', mobileUser);