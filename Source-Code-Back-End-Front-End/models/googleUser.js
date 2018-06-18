const mongoose                  = require('mongoose');
const Schema                    = mongoose.Schema;

// This is google customer schema.
const userSchema = new Schema({
    username: String,
    googleId: String,
});

const User = mongoose.model('GoogleUserSchema', userSchema);

module.exports = User;