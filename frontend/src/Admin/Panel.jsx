import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Plus, Trash2, LayoutGrid, CalendarDays, CalendarClock, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Badge } from "../components/ui/badge"
import { EventForm } from "../components/EventForm"
import { DeleteConfirmation } from "../components/DeleteConfirmation"
import { EventDetails } from "../components/EventDetails"
import { Progress } from "../components/ui/progress"
import axiosClient from "../api/axiosClient"
import { useUser } from "../context/AuthContext"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const { user, userLoading } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventData = await axiosClient.get("/admin/events");
      setEvents(eventData.data.data);
    }

    fetchEvents();
  }, [events]);


  const handleLogout = async () => {
    const data = await axiosClient.post("/logout", { user }, { withCredentials: true });
    const response = data.data;
    await Swal.fire({
      position: "top",
      toast: true,
      timer: 2000,
      timerProgressBar: true,
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton: false,
      showDenyButton: false,
      title: response.msg,
      icon: response.success ? "success" : "error"
    });
    { window.location.href = "/" }
  }

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, eventId: null, eventTitle: "" })
  const [selectedEvent, setSelectedEvent] = useState(null)

  const totalEvents = events.length
  const upcomingEvents = events.filter((event) => event.status === "upcoming").length
  const pastEvents = events.filter((event) => event.status === "past").length
  const totalRegistrations = events.reduce((sum, event) => sum + (event.registeredCount || 0), 0)

  const handleCreateEvent = async (newEvent) => {
    const newData = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      amountPerPerson: Number(newEvent.price.split(" ")[1]),
      category: newEvent.category,
      capacity: Number(newEvent.capacity),
      status: "upcoming",
      registeredCount: 0,
      location: newEvent.location,
      image: '/img.jpg'
    }

    const res = await axiosClient.post("/admin/events", newData);
    const result = res.data;

    navigate("/organizer");

    await Swal.fire({
      toast: true,
      timer: 2000,
      timerProgressBar: true,
      position: "top",
      icon: result.success ? "success" : "error",
      title: result.msg,
      showConfirmButton: false,
      showCancelButton: false
    });
    setIsCreateDialogOpen(false);
  }

  const handleUpdateEvent = async (updatedEvent) => {
    const newData = {
      title: updatedEvent.title,
      description: updatedEvent.description,
      date: updatedEvent.date,
      time: updatedEvent.time,
      amountPerPerson: Number(updatedEvent.price.split(" ")[1]),
      category: updatedEvent.category,
      capacity: Number(updatedEvent.capacity),
      status: "upcoming",
      registeredCount: 0,
      location: updatedEvent.location,
      image: '/img.jpg'
    };

    const res = await axiosClient.put(`/admin/events/${updatedEvent._id}`, newData);
    const result = res.data;

    navigate("/organizer");

    await Swal.fire({
      toast: true,
      timer: 2000,
      timerProgressBar: true,
      position: "top",
      icon: result.success ? "success" : "error",
      title: result.msg,
      showConfirmButton: false,
      showCancelButton: false
    });

    setSelectedEvent(null);
  }

  const handleDeleteEvent = async () => {
    const res = await axiosClient.delete(`/admin/events/${deleteConfirmation.eventId}`);
    const result = res.data;
    navigate("/organizer");

    await Swal.fire({
      toast: true,
      timer: 2000,
      timerProgressBar: true,
      position: "top",
      icon: result.success ? "success" : "error",
      title: result.msg,
      showCancelButton: false,
      showConfirmButton: false
    });

    setDeleteConfirmation({ isOpen: false, eventId: null, eventTitle: "" });
  }

  const openDeleteConfirmation = (event) => {
    setDeleteConfirmation({
      isOpen: true,
      eventId: event._id,
      eventTitle: event.title,
    })
  }

  const viewEventDetails = (event) => {
    setSelectedEvent(event)
  }

  return (
    <div className="min-h-screen bg-[#0F0617] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 p-4 sticky top-0 z-10 bg-[#0F0617] backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">CU LIVE</h1>
            <p className="text-xs uppercase tracking-widest text-purple-300">ADMIN</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleLogout} variant="ghost" className="text-purple-300 hover:text-white hover:bg-purple-900/50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Events</p>
                  <p className="text-3xl font-bold mt-1">{totalEvents}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#2D1B48] flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#8A4FFF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Upcoming Events</p>
                  <p className="text-3xl font-bold mt-1">{upcomingEvents}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#2D1B48] flex items-center justify-center">
                  <CalendarClock className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Past Events</p>
                  <p className="text-3xl font-bold mt-1">{pastEvents}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#2D1B48] flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Registrations</p>
                  <p className="text-3xl font-bold mt-1">{totalRegistrations.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#2D1B48] flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#CB202D]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Event Management</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CB202D] hover:bg-[#E03744] text-white">
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A0B2E] border border-purple-900/50 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={handleCreateEvent} onCancel={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-[#1A0B2E] border border-purple-900/50 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#2D1B48] data-[state=active]:text-white">
              <LayoutGrid className="mr-2 h-4 w-4" />
              All Events
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#2D1B48] data-[state=active]:text-white">
              <CalendarClock className="mr-2 h-4 w-4" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-[#2D1B48] data-[state=active]:text-white">
              <CalendarDays className="mr-2 h-4 w-4" />
              Past Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                return <EventCard
                  key={event._id}
                  event={event}
                  onDelete={() => openDeleteConfirmation(event)}
                  onView={() => viewEventDetails(event)}
                />
              })}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((event) => event.status === "upcoming")
                .map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onDelete={() => openDeleteConfirmation(event)}
                    onView={() => viewEventDetails(event)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((event) => event.status === "past")
                .map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onDelete={() => openDeleteConfirmation(event)}
                    onView={() => viewEventDetails(event)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, eventId: null, eventTitle: "" })}
        onConfirm={handleDeleteEvent}
        eventTitle={deleteConfirmation.eventTitle}
      />

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={handleUpdateEvent}
        />
      )}
    </div>
  )
}

function EventCard({ event, onDelete, onView }) {
  const registeredCount = event.registeredCount || 0
  const capacity = event.capacity || 1000
  const percentageFilled = Math.round((registeredCount / capacity) * 100)

  // Calculate color based on percentage
  let progressColor = "bg-green-500"
  if (percentageFilled > 80) {
    progressColor = "bg-[#CB202D]"
  } else if (percentageFilled > 50) {
    progressColor = "bg-orange-500"
  }

  return (
    <Card
      className="overflow-hidden bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/70 transition-all hover:shadow-lg hover:shadow-purple-900/20"
      onClick={onView}
    >
      <div className="relative">
        <img src={event.image || "/placeholdenr.svg"} alt={event.title} className="w-full h-48 object-cover" />
        <Badge className={`absolute top-3 right-3 ${event.status === "upcoming" ? "bg-green-600" : "bg-gray-600"}`}>
          {event.status === "upcoming" ? "Upcoming" : "Past"}
        </Badge>

        {/* Registration badge */}
        <div className="absolute top-3 left-3 bg-[#1A0B2E] text-white px-2 py-1 rounded-md flex items-center gap-1 border border-purple-900/50">
          <Users className="h-3 w-3" />
          <span className="text-xs font-medium">{registeredCount.toLocaleString()}</span>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold line-clamp-2">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex items-center text-sm text-purple-300 mb-1">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{event.date}</span>
          <span className="mx-1">|</span>
          <Clock className="h-4 w-4 mr-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-sm text-purple-300 mb-3">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Registration progress */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-purple-300">Registration</span>
            <span
              className={
                percentageFilled > 80 ? "text-[#CB202D]" : percentageFilled > 50 ? "text-orange-500" : "text-green-500"
              }
            >
              {percentageFilled}%
            </span>
          </div>
          <Progress
            value={percentageFilled}
            className="h-1.5 bg-[#2D1B48]"
            indicatorColor={progressColor}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t border-purple-900/30">
        <div className="font-bold">{event.amountPerPerson}</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 border-purple-500 text-purple-300 hover:bg-purple-900/30 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}