const { Schema, model } = require("mongoose");

const razorpayFields = new Schema({
    paymentId: String,
    orderId: String,
    sign: String
});

const razorpayModel = model("razorpayFields", razorpayFields);

module.exports = razorpayModel;