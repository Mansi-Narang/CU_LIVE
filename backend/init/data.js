require('dotenv').config();
const eventModel = require("../models/Event");
const mongoose = require("mongoose");
const connectDb = async () => {
    await mongoose.connect("mongodb+srv://mansinarang155:XLJceDrWp6fY26Gv@cucluster.1ymlw.mongodb.net/?retryWrites=true&w=majority&appName=cucluster");
}

connectDb().then(() => {
    console.log("Database connected Successfully");
}).catch((e) => {
    console.error(e);
});

const events = [
    {
        title: "Tech Summit 2025",
        location: "Kalpana Chawla Center",
        date: "2025-05-15",
        category: "Hackathon",
        capacity: 500,
        status: "upcoming",
        time: "09:00 AM",
        isPaid: true,
        amountPerPerson: 149.99,
        description: "Join us for the biggest tech conference of the year. Network with industry leaders and discover the latest innovations in AI, blockchain, and cloud computing.",
        image: "https://images.contentstack.io/v3/assets/bltdc2476c7b6b194dd/blt53ff42ca15dff650/62c41fbd8196b233b76a34c5/Tech-Summit-2022-Main.jpg",
        registeredCount: 342
    },
    {
        title: "Summer Music Festival",
        location: "Block D5",
        date: "2025-07-20",
        category: "Music",
        capacity: 2000,
        status: "upcoming",
        time: "12:00 PM",
        isPaid: true,
        amountPerPerson: 75.00,
        description: "A full-day outdoor music festival featuring local and international artists across three stages. Food vendors and activities for all ages.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7vJDrlFjeEMhmtiJmsviCQxexPvqyBuOqfw&s",
        registeredCount: 1250
    },
    {
        title: "Cooking Masterclass",
        location: "Block B2",
        date: "2025-04-25",
        category: "Food",
        capacity: 30,
        status: "upcoming",
        time: "06:30 PM",
        isPaid: true,
        amountPerPerson: 65.00,
        description: "Learn professional cooking techniques from Chef Maria Garcia. This hands-on class will teach you to prepare a three-course gourmet meal.",
        image: "https://cloudfront.bernews.com/wp-content/uploads/2022/03/Easter-UMAMI-Takeover-Bermuda-March-2022.jpg",
        registeredCount: 28
    },
    {
        title: "Startup Weekend",
        location: "CU TBI",
        date: "2025-03-22",
        category: "Business",
        capacity: 150,
        status: "past",
        time: "08:00 AM",
        isPaid: true,
        amountPerPerson: 50.00,
        description: "54-hour weekend event where entrepreneurs, designers, and developers come together to share ideas, form teams, and launch startups.",
        image: "https://ciistartupreneurawards.in/images/confrence/6.jpg",
        registeredCount: 118
    },
    {
        title: "Yoga in the Park",
        location: "Herbal garden",
        date: "2025-06-01",
        category: "Fitness",
        capacity: 50,
        status: "upcoming",
        time: "07:30 AM",
        isPaid: false,
        amountPerPerson: 0.00,
        description: "Start your day with a rejuvenating yoga session in the heart of the city. All levels welcome. Bring your own mat and water bottle.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        registeredCount: 32
    },
    {
        title: "Artificial Intelligence Workshop",
        location: "Seminar Hall C2",
        date: "2025-05-08",
        category: "Education",
        capacity: 75,
        status: "upcoming",
        time: "10:00 AM",
        isPaid: true,
        amountPerPerson: 199.99,
        description: "Comprehensive workshop covering AI fundamentals, machine learning concepts, and practical applications. Includes hands-on coding sessions.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvaUTyHrqV6fn_eBeKUFCPCVMzSha2_yu1SQ&s",
        registeredCount: 51
    },
    {
        title: "Art Exhibition: Future Perspectives",
        location: "Modern Art Gallery",
        date: "2025-03-15",
        category: "Art",
        capacity: 200,
        status: "past",
        time: "11:00 AM",
        isPaid: true,
        amountPerPerson: 15.00,
        description: "Contemporary art exhibition featuring works by emerging artists exploring themes of technology, nature, and human connection.",
        image: "https://img.freepik.com/free-vector/flat-design-art-exhibition-poster-template_52683-87092.jpg",
        registeredCount: 178
    },
    {
        title: "Science Fair for Kids",
        location: "Block D1 Stalls",
        date: "2025-07-05",
        category: "Education",
        capacity: 150,
        status: "upcoming",
        time: "10:00 AM",
        isPaid: true,
        amountPerPerson: 10.00,
        description: "Interactive science fair with demonstrations, experiments, and hands-on activities for children ages 6-14. Fun learning experience for the whole family.",
        image: "https://img.freepik.com/free-vector/flat-design-art-exhibition-poster-template_52683-87092.jpg",
        registeredCount: 95
    }
];


let initEvents = async () => {
    await eventModel.deleteMany({});
    await eventModel.insertMany(events);
}

initEvents().then(() => {
    console.log("Events data has been initialized successfully");
}).catch((e) => {
    console.error(e);
});