const { model } = require("mongoose");

const eventSchema = require("../schemas/event");

const eventModel = model("event", eventSchema);

module.exports = eventModel;