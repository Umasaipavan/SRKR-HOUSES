import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Bolt, MapPin, Flame, Wind, Mountain, Droplet, Cloud, Trophy, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Map house IDs to their respective details
const houseIcons = {
  'Agni': { icon: <Flame size={40} />, color: 'bg-red-500', textColor: 'text-red-500', hoverColor: 'hover:bg-red-500/10', fullColor: 'from-red-600 to-orange-500' },
  'Vayu': { icon: <Wind size={40} />, color: 'bg-blue-500', textColor: 'text-blue-500', hoverColor: 'hover:bg-blue-500/10', fullColor: 'from-blue-600 to-blue-400' },
  'Prudhvi': { icon: <Mountain size={40} />, color: 'bg-green-500', textColor: 'text-green-500', hoverColor: 'hover:bg-green-500/10', fullColor: 'from-green-600 to-green-400' },
  'Jal': { icon: <Droplet size={40} />, color: 'bg-teal-500', textColor: 'text-teal-500', hoverColor: 'hover:bg-teal-500/10', fullColor: 'from-teal-600 to-teal-400' },
  'Aakash': { icon: <Cloud size={40} />, color: 'bg-purple-500', textColor: 'text-purple-500', hoverColor: 'hover:bg-purple-500/10', fullColor: 'from-purple-600 to-purple-400' },
};

// House descriptions - keep these for now
const houseDescriptions = {
  'Agni': 'House of Fire and Passion. Known for their courage and determination.',
  'Vayu': 'House of Wind and Freedom. Values intellect and adaptability.',
  'Prudhvi': 'House of Earth and Stability. Emphasizes strength and tradition.',
  'Jal': 'House of Water and Flow. Known for their resilience and emotional depth.',
  'Aakash': 'House of Sky and Wisdom. Values knowledge and innovation.',
};

const houseBgs = {
  'Agni': '../assets/logos/2.jpeg',
  'Vayu': '../assets/logos/3.jpeg',
  'Prudhvi': '../assets/logos/4.jpeg', 
  'Jal': '../assets/logos/1.jpeg',
  'Aakash': '../assets/logos/6.jpeg',
};
// Map house names to their IDs
const houseNameToId = {
  'agni': 1,
  'vayu': 2,
  'jal': 3,
  'prudhvi': 4,
  'aakash': 5
};

function HousePage() {
  const { houseName: houseNameParam } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [houseData, setHouseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchHouseData = async () => {
      try {
        setLoading(true);
        const hid = houseNameToId[houseNameParam?.toLowerCase()];
        
        if (!hid) {
          setError('House not found');
          setLoading(false);
          return;
        }
        const API_URL = import.meta.env.VITE_API_URL;    
        const response = await fetch(`${API_URL}/fetch_housewise.php?hid=${hid}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setHouseData(data.data);
        } else {
          setError('Failed to fetch house data');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching house data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [houseNameParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !houseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">{error || 'House not found'}</h1>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { house, members, events, statistics } = houseData;
  const houseName = house.house_name;
  const houseStyle = houseIcons[houseName] || houseIcons.Prudhvi; // Default to Prudhvi if not found
  const houseDescription = houseDescriptions[houseName] || '';
  const houseBg = houseBgs[houseName] || houseBgs.Prudhvi;

  // Sort members by total points (descending)
  const sortedMembers = [...members].sort((a, b) => 
    parseInt(b.total_points) - parseInt(a.total_points)
  );

  // Get top 6 contributors
  const topContributors = sortedMembers.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with House Background */}
      <div
        className="relative pt-24 pb-20 md:pt-32 md:pb-28 flex items-start justify-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${houseBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-0 left-4 bg-background/20 backdrop-blur-sm text-foreground rounded-full p-2 md:p-3 hover:bg-background/30 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="text-center text-white">
            <span className={`inline-block ${houseStyle.color} text-white text-sm font-semibold rounded-full px-3 py-1 mb-4`}>
              {houseName} House
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{houseName}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">{houseDescription}</p>
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Trophy className="mr-2 h-5 w-5" /> 
              <span>Rank #{house.rank} with {house.points} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About House */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-xl p-8 border shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <div className={`${houseStyle.textColor} mr-3`}>{houseStyle.icon}</div>
                  About House {houseName}
                </h2>
                
                <p className="text-foreground/90 leading-relaxed mb-6">
                  House {houseName} represents one of the five elemental houses at SRKR Engineering College's CSD & CSIT departments. 
                  Each student is assigned to a house upon joining, creating a sense of community and healthy competition.
                </p>
                
                <p className="text-foreground/90 leading-relaxed mb-6">
                  Students in House {houseName} participate in various technical and non-technical events throughout the academic year, 
                  earning points for their house and contributing to its overall ranking.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">House Values</h3>
                  <ul className="space-y-2">
                    <li className={`flex items-center p-3 rounded-lg ${houseStyle.hoverColor} transition-colors`}>
                      <div className={`${houseStyle.color} rounded-full p-2 mr-4`}>
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span>Teamwork and Collaboration</span>
                    </li>
                    <li className={`flex items-center p-3 rounded-lg ${houseStyle.hoverColor} transition-colors`}>
                      <div className={`${houseStyle.color} rounded-full p-2 mr-4`}>
                        <Bolt className="h-5 w-5 text-white" />
                      </div>
                      <span>Innovation and Creativity</span>
                    </li>
                    <li className={`flex items-center p-3 rounded-lg ${houseStyle.hoverColor} transition-colors`}>
                      <div className={`${houseStyle.color} rounded-full p-2 mr-4`}>
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span>Leadership and Excellence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* House Statistics */}
            <div>
              <div className="bg-background rounded-xl p-8 border shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-6">House Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/30">
                    <Users className={`${houseStyle.textColor}`} size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="font-semibold">{statistics.totalMembers}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/30">
                    <Bolt className={`${houseStyle.textColor}`} size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                      <p className="font-semibold">{statistics.activeMembers}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/30">
                    <Trophy className={`${houseStyle.textColor}`} size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="font-semibold">{statistics.totalPoints}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/30">
                    <Calendar className={`${houseStyle.textColor}`} size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Events Participated</p>
                      <p className="font-semibold">{statistics.eventsParticipated}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Top Contributors from {houseName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topContributors.map((member, index) => (
              <div key={member.user_id} className="bg-background rounded-xl p-6 border shadow-sm flex items-center">
                <div className={`${houseStyle.color} rounded-full h-12 w-12 flex items-center justify-center text-white font-bold`}>
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.username} • {member.branch}</p>
                  <p className="text-sm font-medium mt-1">{member.total_points} Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      {events && events.length > 0 && (
        <div className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">House Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => {
                const eventDate = new Date(event.event_date);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                return (
                  <div key={event.event_id} className="bg-background rounded-xl overflow-hidden border shadow-sm">
                   
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formattedDate} • {event.venue}
                      </div>
                      <p className="line-clamp-3 mb-4">
                        {event.description.split('\r\n')[0]}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                          Participation: {event.participate_points} points
                        </span>
                        {event.winner_points > 0 && (
                          <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                            Winner: {event.winner_points} points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default HousePage;