import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Users, Ticket } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { EventForm } from "../components/EventForm"
import { EventAnalytics } from "../components/EventAnalytics"
import { EventRegistrationStats } from "../components/EventRegisterationStats"
import { Badge } from "../components/ui/badge"
import QrScanner from 'qr-scanner';

export function EventDetails({ event, isOpen, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const isPastEvent = event.status === "past";
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [htmlScanner, setHtmlScanner] = useState(null);
  const scannerContainerId = "qr-scanner-container";

  const handleEditSubmit = (updatedEvent) => {
    onUpdate({ ...event, ...updatedEvent })
    setIsEditing(false)
  }

  const handleScanClick = () => {
    setIsScanning(!isScanning);
  }

  useEffect(() => {
    if (isScanning && !htmlScanner) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
        const vidElement = document.querySelector(`#${scannerContainerId}`);
        vidElement.srcObject = mediaStream;

        const scanner = new QrScanner(vidElement, (res) => {
          console.log(res);
        }, { returnDetailedScanResult: true });

        scanner.start().then((data) => {
          console.log(data);
        });
      });
    }

    // Cleanup function to stop scanner when component unmounts or isScanning changes to false
    return () => {
      if (htmlScanner) {
        htmlScanner.stop().then(() => {
          console.log("Scanner stopped");
          setHtmlScanner(null);
        }).catch(err => {
          console.error("Error stopping scanner:", err);
        });
      }
    };
  }, [isScanning]);

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#0F0617] border border-purple-900/50 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {isEditing ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(false)}
                        className="h-8 w-8 rounded-full"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    Edit Event
                  </DialogTitle>
                </DialogHeader>
                <EventForm
                    initialData={event}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setIsEditing(false)}
                    isEditing={true}
                />
              </>
          ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    Event Details
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6">
                  {/* Event Header */}
                  <div className="relative">
                    <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    <Badge
                        className={`absolute top-4 left-4 ${event.status === "upcoming" ? "bg-green-600" : "bg-gray-600"}`}
                    >
                      {event.status === "upcoming" ? "Upcoming" : "Past"}
                    </Badge>
                    {!isPastEvent && (
                        <Button
                            className="absolute top-4 right-4 bg-[#2D1B48] hover:bg-[#3D2B58]"
                            onClick={() => setIsEditing(true)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Event
                        </Button>
                    )}
                  </div>

                  {/* Event Info */}
                  <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

                      <div className="mb-6">
                        <Button
                            size="sm"
                            variant="default"
                            className={`h-8 px-3 py-0 ${isScanning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white mb-4`}
                            onClick={handleScanClick}
                        >
                          <span role="img" aria-label="Scan">📷</span>
                          <span className="ml-1">{isScanning ? "Stop Scanning" : "Scan Student"}</span>
                        </Button>

                        {isScanning && (
                            <div className="mt-4">
                              <video autoPlay playsInline id={scannerContainerId} className="w-full max-w-md h-64 bg-black rounded-lg mb-4 overflow-hidden"></video>

                              {scanResult && (
                                  <div className="mt-2 p-3 bg-green-900/30 border border-green-500 rounded-md">
                                    <p className="font-medium">Scanned Result:</p>
                                    <p className="text-green-300">{scanResult}</p>
                                  </div>
                              )}
                            </div>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <div className="flex items-center text-purple-300">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-purple-300">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-purple-300">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <div className="bg-[#2D1B48] p-4 rounded-lg hover:bg-[#3D2B58] transition-colors">
                          <div className="flex items-center text-purple-300 mb-1">
                            <Ticket className="h-4 w-4 mr-2" />
                            <span>Price</span>
                          </div>
                          <div className="text-xl font-bold">{event.price}</div>
                        </div>
                        <div className="bg-[#2D1B48] p-4 rounded-lg hover:bg-[#3D2B58] transition-colors">
                          <div className="flex items-center text-purple-300 mb-1">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Capacity</span>
                          </div>
                          <div className="text-xl font-bold">{event.capacity?.toLocaleString() || 1000}</div>
                        </div>
                        <div className="bg-[#2D1B48] p-4 rounded-lg hover:bg-[#3D2B58] transition-colors">
                          <div className="flex items-center text-purple-300 mb-1">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Registered</span>
                          </div>
                          <div className="text-xl font-bold">
                            {event.registeredCount?.toLocaleString() || (isPastEvent ? 850 : 450)}
                          </div>
                        </div>
                        <div className="bg-[#2D1B48] p-4 rounded-lg hover:bg-[#3D2B58] transition-colors">
                          <div className="flex items-center text-purple-300 mb-1">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Attendance</span>
                          </div>
                          <div className="text-xl font-bold">
                            {event.attendanceCount?.toLocaleString() || (isPastEvent ? 700 : 0)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-purple-300">
                          {event.description ||
                              "Join us for this exciting event! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics or Registration Stats based on event status */}
                  {isPastEvent ? (
                      <Tabs defaultValue="analytics" className="w-full">
                        <TabsList className="bg-[#1A0B2E] border border-purple-900/50 mb-6">
                          <TabsTrigger
                              value="analytics"
                              className="data-[state=active]:bg-[#2D1B48] data-[state=active]:text-white"
                          >
                            Analytics
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="analytics">
                          <EventAnalytics event={event} />
                        </TabsContent>
                      </Tabs>
                  ) : (
                      <Tabs defaultValue="registrations" className="w-full">
                        <TabsList className="bg-[#1A0B2E] border border-purple-900/50 mb-6">
                          <TabsTrigger
                              value="registrations"
                              className="data-[state=active]:bg-[#2D1B48] data-[state=active]:text-white"
                          >
                            Registration Stats
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="registrations">
                          <EventRegistrationStats event={event} />
                        </TabsContent>
                      </Tabs>
                  )}
                </div>
              </>
          )}
        </DialogContent>
      </Dialog>
  )
}