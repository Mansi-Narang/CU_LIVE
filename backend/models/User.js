const {model} = require('mongoose');
const UserSchema = require('../schemas/User');

const userModel = new model('user' , UserSchema);

module.exports = userModel;