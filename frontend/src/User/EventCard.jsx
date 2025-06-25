import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import axiosClient from "../api/axiosClient";

const EventCard = ({ event }) => {

  return (
      <Card
        sx={{
          maxWidth: 280,
          margin: "auto",
          borderRadius: "0.6rem",
          padding: 0
        }}
        className="rounded-3xl shadow-lg border border-gray-200"
      >
        <CardMedia component="img" image={event.image} alt="Poster" sx={{
          height: "348px",
          width: "500px"
        }} />
        <CardHeader
          sx={{ padding: "0.5rem" }}
          title={<p className="text-lg font-semibold">{event.title}</p>}
        />
        <CardContent sx={{ padding: "0.5rem" }}>
          <Typography variant="body2" color="textSecondary">
            <p className="flex items-center gap-1">
              <CalendarMonthIcon fontSize="small" /> {event.date} | {event.time}
            </p>
            <p className="flex items-center gap-1 mt-1">
              <LocationOnIcon fontSize="small" /> {event.location}
            </p>
          </Typography>
        </CardContent>
        <Button
          sx={{
            margin: "0.5rem auto",
            display: "block",
            padding: "0.5rem 1rem",
            backgroundColor: "#E5E7EB", // Light Gray Background
            color: "black", // Black Text
            fontWeight: 600, // Semi-bold font
            borderRadius: "8px", // Rounded Corners
            "&:hover": {
              backgroundColor: "#D1D5DB", // Slightly Darker Gray on Hover
            },
          }}
        >
          Register
        </Button>
      </Card>
  );
};

export default EventCard;
