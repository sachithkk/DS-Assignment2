const mongoose                  = require('mongoose'); // get mongoose module.
const Schema                    = mongoose.Schema; // create mongoose Schema.

// This module is used for password encrypted
const bcrypt = require('bcrypt-nodejs');

// Create user schema.
const userSchema = new Schema({
    fname:{type:String, required:true},
    lname:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
});

// password encrypt method using bcrypt-nodejs module.
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// password validation method.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// export model
module.exports = mongoose.model('User', userSchema);