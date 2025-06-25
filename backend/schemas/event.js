const { Schema, Types } = require("mongoose");

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        set: (v) => {
            if(v <= 0) return 0;
            else return v;
        }
    },
    status: {
        type: String,
        enum: ['upcoming', 'past']
    },
    time: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        set: (v) => {
            if(!v || v <= 0) return 0;
            else return v;
        }
    },
    amountPerPerson: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    registeredCount: {
        type: Number,
    },
    registeredUsers: {
        type: [Types.ObjectId],
        ref: 'user',
        default: []
    }
});

module.exports = eventSchema;