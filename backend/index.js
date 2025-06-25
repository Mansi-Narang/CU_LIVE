require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;
const randomOtpGenerator = require("./utils/otpGenerator");
const mailSender = require("./utils/mailSender.js");
const userModel = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;
const expressSession = require("express-session");
const cors = require('cors');
const RazorpayClient = require("./razorpay.js");
const cookieParser = require("cookie-parser");
const eventModel = require("./models/Event.js");
const MongoStore = require('connect-mongo');
const adminChecker = require("./utils/adminChecker.js");
const errorHandler = require("./utils/errorHandler.js");
const generateTicket = require("./utils/ticket.js");
const razorpayModel = require("./models/razorpayFields.js");

const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    touchAfter: 3 * 24 * 3600,
    crypto: {
        secret: process.env.SECRET
    }
});

store.on('error', (e) => console.log(e));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(
    expressSession({
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            maxAge: Date.now() + 3 * 24 * 60 * 60 * 1000,
            expires: 3 * 24 * 60 * 60 * 1000
        },
        saveUninitialized: false,
        resave: true,
        store
    })
);

let connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
};

connectDb()
    .then(() => {
        console.log("MongoDb Connected Successfully");
    })
    .catch((e) => {
        console.error("Error while connecting to MongoDB Database");
    });

app.get("/", (req, res) => {
    res.send("Server is Listening to the / Route");
});

app.post("/otp", async (req, res) => {
    const { uid } = req.body;
    const mail = uid + "@" + process.env.UNIVERSITY_MAIL_DOMAIN;
    const otp = randomOtpGenerator();
    const textContent = `Your OTP for verification is: ${otp}`;
    const htmlContent = `<p>Your OTP for verification is: <strong>${otp}</strong></p>`;
    const subject = "OTP Verification for CU Events";

    await mailSender({
        textContent,
        htmlContent,
        receiverMail: mail,
        subject,
    });

    return res.json({ success: true, otp });
});

app.post("/signup", async (req, res) => {
    let { name, uid, password } = req.body;
    uid = uid.toLowerCase();
    const email = uid + "@" + process.env.UNIVERSITY_MAIL_DOMAIN;
    const existingUser = await userModel.findOne({ uid });
    if (existingUser) {
        return res.json({
            msg: "User already exists, kindly Log In",
            success: false,
        });
    }
    const newUser = new userModel({ uid, name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_TOKEN, { expiresIn: "3d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.json({ msg: "User Registered Successfully!", success: true });
});

app.post("/login", async (req, res) => {
    let { uid, password } = req.body;
    uid = uid.toLowerCase();

    if (!uid || !password) {
        throw new Error("Insufficient Credentials provided");
    }

    const user = await userModel.findOne({ uid });

    if (!user) {
        return res.json({
            msg: "User doesn't exists",
            success: false,
        });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
        const token = jwt.sign({ id: user._id }, JWT_TOKEN, {
            expiresIn: "3d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
    }

    isSamePassword
        ? res.json({
            msg: "Logged In Successfully",
            success: true,
            isOrganizer: uid === '23bcs14148' ? true : false
        })
        : res.json({
            msg: "Incorrect Password",
            success: false,
        });
});

app.get("/user", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ msg: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_TOKEN);
        const user = await userModel.findById(decoded.id);

        if (!user) return res.json({ error: 'User not found' });
        return res.json({ user: { id: user._id, username: user.username, email: user.email } });
    } catch (e) { console.error(e); return res.json({ error: "Invalid token" }); }
});

app.post("/registerEvent", errorHandler(async (req, res) => {
    try {
        const { user, event } = req.body;
        console.log(user);
        if (!user || !event) throw new Error("No Event Id or user id provided");

        const secondEvent = await eventModel.findById(event._id);
        const secondUser = await userModel.findById(user.id);

        console.log(secondUser);
        if(!secondUser) return res.json({ success: false, msg: "Unable to register the user for the event" });

        if(!user || !event) {
            throw new Error("Invalid Event or User");
        }

        const ticket = await generateTicket(secondUser, secondEvent);

        await mailSender({
            receiverMail: user.email,
            attachments: [ticket],
            htmlContent: `<p>Hello ${secondUser.name},</p>
             <p>Thank you for registering for <strong>${event.title}</strong>. Your ticket is attached to this email.</p>
             <h3>Event Details:</h3>
             <p><strong>Date:</strong> ${event.date}<br>
             <strong>Time:</strong> ${event.time}<br>
             <strong>Location:</strong> ${event.location}</p>
             <p>Please bring this ticket with you to the event for check-in.</p>`,
            subject: `Your ticket for ${event.title}`,
            textContent: `Hello ${secondUser.name},\n\nThank you for registering for ${event.title}. Your ticket is attached to this email.\n\nEvent Details:\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\nPlease bring this ticket with you to the event for check-in.`
        });

        secondEvent.registeredCount += 1;
        secondEvent.registeredUsers.push(user.id);
        secondUser.registeredEvents.push(secondEvent._id);

        await secondEvent.save();
        await secondUser.save();

        return res.json({ success: true, msg: "User Registered Successfully " });
    }
    catch (e) {
        console.log(e);
        return res.json({ success: false, msg: "Unable to register the user for the event" });
    }
}));


app.post("/razorpaySign", errorHandler(async (req, res) => {
    const { paymentId, sign, orderId } = req.body;
    const newRazorpaySign = new razorpayModel({ paymentId, orderId, sign });

    await newRazorpaySign.save();

    return res.json({ success: true, msg: "RazorpaySign Successful" });
}));

app.post("/orders/create", async (req, res) => {
    const { amount, currency } = req.body;
    const response = await RazorpayClient.orders.create({
        amount, currency
    });
    return res.json({ success: true, order: response, key: process.env.RAZORPAY_KEY_ID });
});

app.post("/logout", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ msg: "Unauthorized" });

    const { user } = req.body;

    let user2 = await userModel.findById(user.id);
    if (!user2) return res.json({ msg: "Unable to find the user", success: false });
    else {
        res.clearCookie("token");
        return res.json({ success: true, msg: "Successfully Logged Out." });
    }
})

app.post('/events/list', async (req, res) => {
    const { event } = req.body;

    if (!event) {
        return res.json({ msg: "Fill the form !", success: false });
    }
    const existingEvent = await eventModel.findOne({ title: event.title });
    if (existingEvent) {
        return res.json({ msg: "Event already registered!", status: false });
    }
    const newEvent = await eventModel.create({
        about: event.about, amountPerPerson: Number(event.amountPerPerson).toFixed(2), location: event.location, category: event.category, time: event.time, date: event.date, isPaid: event.isPaid, title: event.title
    });

    return res.json({ msg: "Event Listed Successfully!", success: true });
})

app.get("/events", async (req, res) => {
    const events = await eventModel.find();

    if (!events.length) return res.json({ data: null });

    return res.json({ data: events });
});

app.get("/events/:eventId", async (req, res) => {
    const { eventId } = req.params;

    const event = await eventModel.findById(eventId);
    return res.json({ data: !event ? null : event });
});

app.get('/admin/events', adminChecker, errorHandler(async (req, res) => {
    if (!req.isAdmin) throw new Error("User is not an Admin");
    const events = await eventModel.find({});
    if (!events) throw new Error("You have added no events!");
    return res.json({ success: true, data: events });
}));

app.post("/admin/events", adminChecker, errorHandler(async (req, res) => {
    if (!req.isAdmin) throw new Error("User is not an Admin");
    const data = req.body;
    if (!data) throw new Error("No Event Data Provided");
    const newEvent = new eventModel(data);
    await newEvent.save();

    return res.json({ success: true, msg: "Successfully Posted the Event" });
}));

app.get("/admin/events/:id", adminChecker, errorHandler(async (req, res) => {
    if (!req.isAdmin) throw new Error("User is not an Admin");
    const { id } = req.params;
    const event = await eventModel.findById(id);
    return res.json({ data: event, success: true });
}));

app.put("/admin/events/:id", adminChecker, errorHandler(async (req, res) => {
    if (!req.isAdmin) throw new Error("User is not an Admin");
    const { id } = req.params;
    const data = req.body;
    await eventModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
    return res.json({ success: true, msg: "Successfully Edited the Event" });
}));

app.delete('/admin/events/:id', adminChecker, errorHandler(async (req, res) => {
    if (!req.isAdmin) throw new Error("User is not an Admin");
    const { id } = req.params;
    const data = await eventModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Successfully Deleted the Event" });
}));

app.listen(PORT, () => {
    console.log("App started on the PORT: " + PORT);
});

process.on("unhandledRejection", (e) => {
    console.error(e);
});
