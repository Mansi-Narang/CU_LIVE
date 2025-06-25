const { Schema } = require('mongoose');
const bcrypt = require("bcryptjs");
const eventModel = require('../models/Event');

const UserSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    registeredEvents: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'event'
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = UserSchema;