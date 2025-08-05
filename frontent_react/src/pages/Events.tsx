import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, X } from "lucide-react";

// Allowed house names (in lowercase for case-insensitive matching)
const validHouses = ["aakash", "agni", "vayu", "jal", "prudhvi"];

// Map house IDs to house names
const houseIdToName = {
  "1": "aakash",
  "2": "agni",
  "3": "vayu",
  "4": "jal",
  "5": "prudhvi",
  "6": "Department Event"
};

// Format date from API (YYYY-MM-DD) to more readable format
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Format time from API (HH:MM:SS) to more readable format
const formatTime = (timeString: string) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
};

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  house: string;
  points: {
    participation: number;
    winner: number;
    runner: number;
  };
  acceptRegistrations: boolean;
  onViewMore: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  time,
  location,
  house,
  points,
  acceptRegistrations,
  onViewMore
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            house.toLowerCase() === 'aakash' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            house.toLowerCase() === 'agni' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            house.toLowerCase() === 'vayu' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            house.toLowerCase() === 'jal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
            house.toLowerCase() === 'prudhvi' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {house}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{description}</p>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span className="font-medium mr-1">Date:</span> {date}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span className="font-medium mr-1">Time:</span> {time}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span className="font-medium mr-1">Location:</span> {location}
          </p>
        </div>
        

        <div className="mt-6 flex justify-between items-center">
          {acceptRegistrations && (
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm">
              Register Now
            </button>
          )}
          <button 
            onClick={onViewMore}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'winners' | 'participants' | 'organizers'>('winners');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/fetch_events.php`)
      .then((response) => {
        console.log("API Response:", response);
        if (response.data && response.data.status === "success" && response.data.data) {
          const apiEvents = response.data.data.events.map((event: any) => {
            const houseName = houseIdToName[event.hid] || "unknown";
            
            return {
              id: event.event_id,
              title: event.title,
              description: event.description,
              date: formatDate(event.event_date),
              time: formatTime(event.start_time) + (event.end_time ? ` - ${formatTime(event.end_time)}` : ""),
              location: event.venue,
              house: houseName,
              points: {
                participation: event.participate_points,
                winner: event.winner_points,
                runner: event.runner_points
              },
              acceptRegistrations: event.accept_registrations === "1"
            };
          });
          setEvents(apiEvents);
          setError(null);
        } else {
          console.error("API returned unexpected format:", response.data);
          setEvents([]);
          setError("Could not load events from server. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
        setError("Failed to connect to the server. Please check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchEventDetails = async (eventId: number) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const response = await axios.get(`${API_URL}/fetch_eventberify.php?event_id=${eventId}`);
      
      console.log('Event details response:', response.data);
  
      // Check if response exists and has data
      if (!response?.data) {
        throw new Error('No response data received from server');
      }
  
      // Check for API-level errors
      if (response.data.status !== "success") {
        throw new Error(response.data.error || 'API request failed');
      }
  
      // Extract event data from the response structure
      const eventData = response.data.data?.event;
      if (!eventData) {
        throw new Error('Event data not found in response');
      }
  
      // Format the event details with proper fallbacks
      const formattedEvent = {
        id: eventData.event_id,
        title: eventData.title,
        description: eventData.description,
        date: formatDate(eventData.event_date),
        time: `${formatTime(eventData.start_time)}${eventData.end_time ? ` - ${formatTime(eventData.end_time)}` : ''}`,
        location: eventData.venue,
        house: houseIdToName[eventData.hid] || "Unknown",
        imagePath: eventData.image_path,
        points: {
          participation: eventData.participate_points || 0,
          winner: eventData.winner_points || 0,
          runner: eventData.runner_points || 0
        },
        acceptRegistrations: eventData.accept_registrations === 1,
        winners: eventData.winners || [],
        participants: eventData.participants || [],
        organizers: eventData.organizers || []
      };
  
      setEventDetails(formattedEvent);
    } catch (error) {
      console.error('Error fetching event details:', error);
      
      let errorMessage = 'Failed to load additional event details';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.status === 404 
            ? 'Event details not found' 
            : `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'No response from server';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      setModalError(errorMessage);
      
      // Fallback to basic event info
      setEventDetails({
        ...selectedEvent,
        winners: [],
        participants: [],
        organizers: []
      });
    } finally {
      setModalLoading(false);
    }
  };
  const handleViewMore = (event: any) => {
    setSelectedEvent(event);
    fetchEventDetails(event.id);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setEventDetails(null);
    setActiveTab('winners');
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = selectedHouse === null || event.house === selectedHouse.toLowerCase();
    return matchesSearch && matchesHouse;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary">
      <Navbar />
      <section className="pt-32 pb-12 bg-secondary dark:bg-gray-800 text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">Upcoming Events</h1>
          <p className="mt-4 text-muted-foreground dark:text-gray-300">Discover and participate in various events organized by different houses.</p>
        </div>
      </section>
      <section className="py-8 border-b dark:border-gray-700 px-4">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 rounded-md border bg-background dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <button 
              onClick={() => setSelectedHouse(null)} 
              className={`px-3 py-1 rounded-md text-xs font-medium ${selectedHouse === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
            >
              All
            </button>
            {validHouses.map((house) => (
              <button 
                key={house} 
                onClick={() => setSelectedHouse(house)} 
                className={`px-3 py-1 rounded-md text-xs font-medium ${selectedHouse === house ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"}`}
              >
                {house.charAt(0).toUpperCase() + house.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-primary dark:text-white">Loading events...</h3>
              <p className="mt-2 text-muted-foreground dark:text-gray-300">Please wait while we fetch the latest events.</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  house={event.house !== "unknown" ? event.house.charAt(0).toUpperCase() + event.house.slice(1) : "Unknown"}
                  points={event.points}
                  acceptRegistrations={event.acceptRegistrations}
                  onViewMore={() => handleViewMore(event)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-primary dark:text-white">No events found</h3>
              <p className="mt-2 text-muted-foreground dark:text-gray-300">Try changing your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />

      {/* Event Details Modal */}
      {selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white">{selectedEvent.title}</h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
          <X size={24} />
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="overflow-y-auto flex-1 p-6">
        {modalError && (
          <div className="p-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded">
            {modalError}
          </div>
        )}

        {modalLoading ? (
          <div className="text-center py-8">
            <p>Loading event details...</p>
          </div>
        ) : (
          <>
          {/* Event Description */}
          <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {selectedEvent.description}
              </p>
            </div>
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Date:</span> {selectedEvent.date}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Time:</span> {selectedEvent.time}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Location:</span> {selectedEvent.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">House:</span> {selectedEvent.house}
                </p>
              </div>
              
            </div>

            

            {/* Tab Navigation */}
            <div className="border-b dark:border-gray-700 mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('winners')}
                  className={`px-4 py-2 font-medium ${activeTab === 'winners' ? 'text-primary border-b-2 border-primary dark:text-white dark:border-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  🏆 Winners
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`px-4 py-2 font-medium ${activeTab === 'participants' ? 'text-primary border-b-2 border-primary dark:text-white dark:border-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  

👥  Participants
                </button>
                <button
                  onClick={() => setActiveTab('organizers')}
                  className={`px-4 py-2 font-medium ${activeTab === 'organizers' ? 'text-primary border-b-2 border-primary dark:text-white dark:border-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  📋 Organizers
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto">
              {activeTab === 'winners' && (
                <div>
                  {eventDetails?.winners?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventDetails.winners.map((winner: any) => (
                        <div key={winner.user_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="font-medium">{winner.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {winner.year}/4 - Year {winner.branch}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{winner.username}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4">
                      No winners recorded for this event.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'participants' && (
                <div>
                  {eventDetails?.participants?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventDetails.participants.map((participant: any) => (
                        <div key={participant.user_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {participant.year}/4 {participant.branch}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{participant.username}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4">
                      No participants recorded for this event.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'organizers' && (
                <div>
                  {eventDetails?.organizers?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventDetails.organizers.map((organizer: any) => (
                        <div key={organizer.user_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="font-medium">{organizer.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {organizer.year}/4 {organizer.branch}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{organizer.username}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4">
                      No organizers recorded for this event.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Footer */}
      <div className="p-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
