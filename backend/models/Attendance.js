const { Schema, model } = require('mongoose');

const attendanceSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "event"
    },
    attendee: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    timestamp: {
        type: Date,
        set: () => {
            return Date.now();
        }
    }
});

const attendance = model("attendance", attendanceSchema);
module.exports = attendance;