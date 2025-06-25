import BestEventCard from "../components/BestEventCard";

const BestEvents = () => {
    const events = [
        {
            title: "Marathon",
            desc: "a small marathon",
            image: "https://marketplace.canva.com/EAGMfKHvKo0/1/0/1131w/canva-colorful-watercolor-paint-school-college-art-fair-event-poster-ZGG78kx7RcY.jpg"
        },
        {
            title: "Hackathon",
            desc: "a 24hr hackathon",
            image: "https://marketplace.canva.com/EAGMfKHvKo0/1/0/1131w/canva-colorful-watercolor-paint-school-college-art-fair-event-poster-ZGG78kx7RcY.jpg"
        },
        {
            title: "Technovate",
            image: "https://marketplace.canva.com/EAGMfKHvKo0/1/0/1131w/canva-colorful-watercolor-paint-school-college-art-fair-event-poster-ZGG78kx7RcY.jpg",
            desc: "paid hackathon"
        },
        {
            title: "Marathon",
            desc: "a small marathon",
            image: "https://marketplace.canva.com/EAGMfKHvKo0/1/0/1131w/canva-colorful-watercolor-paint-school-college-art-fair-event-poster-ZGG78kx7RcY.jpg"
        },
    ];
    return(
        <div className="my-20 mx-10">
            <h1 className="text-3xl font-bold text-center text-white">The Best of Events</h1>
            <div className="best-event-cards">
                {events.map((event, idx) => {
                    return <BestEventCard event={event} key={idx} />
                })}
            </div>
        </div>
    );
}

export default BestEvents;