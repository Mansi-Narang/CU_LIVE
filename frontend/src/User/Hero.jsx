// import CollegeCard from "../components/CollegeCard"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "./EventCard";
import EventCarousel from "./Carousel";
import Event from "./Event";
import BestEvents from "./BestEvents";
import Organiser from "./Organiser";

const Hero = () => {
    return(
        <main className="bg-[url('/map-six.png')]">
            <Navbar />
            {/* <CollegeCard /> */}
            <br />
            <EventCarousel/> 
            <BestEvents />
            {/* <Event /> */}
            <Footer/>
        </main>
    );
}

export default Hero;