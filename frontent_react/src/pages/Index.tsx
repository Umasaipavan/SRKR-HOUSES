import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronRight, Star, Trophy, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HouseCard } from '@/components/HouseCard';
import JalImage from '../assets/logos/1.jpg';
import AakashImage from '../assets/logos/5.jpg';
import AgniImage from '../assets/logos/3.jpg';
import VayuImage from '../assets/logos/2.jpg';
import PrudhviImage from '../assets/logos/4.jpg';
import CombineImage from '../assets/logos/allhouses.webp';
import SrkrLogo from '../assets/logos/srkrlogo.png';

type ValidHouse = 'aakash' | 'agni' | 'vayu' | 'jal' | 'prudhvi';

interface House {
  name: string;
  imageSrc: string;
  color: string;
  description: string;
}

interface HouseData {
  hid: number;
  house_name: string;
  points: number;
  rank: number;
}

interface Contributor {
  user_id: number;
  name: string;
  branch: string;
  year: string;
  house_name: string;
  total_points: number;
}

interface Statistics {
  totalEvents: number;
  totalPoints: number;
  activeStudents: number;
}

const houses: House[] = [
  {
    name: 'Agni',
    imageSrc: AgniImage,
    color: 'bg-red-500',
    description: 'House of Fire and Passion',
  },
  {
    name: 'Vayu',
    imageSrc: VayuImage,
    color: 'bg-blue-500',
    description: 'House of Wind and Freedom',
  },
  {
    name: 'Prudhvi',
    imageSrc: PrudhviImage,
    color: 'bg-green-500',
    description: 'House of Earth and Stability',
  },
  {
    name: 'Jal',
    imageSrc: JalImage,
    color: 'bg-teal-500',
    description: 'House of Water and Flow',
  },
  {
    name: 'Aakash',
    imageSrc: AakashImage,
    color: 'bg-purple-500',
    description: 'House of Sky and Wisdom',
  },
];

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      const moveX = x * 20 - 10; // -10px to 10px
      const moveY = y * 20 - 10; // -10px to 10px

      heroRef.current.style.setProperty('--move-x', `${moveX}px`);
      heroRef.current.style.setProperty('--move-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const navigate = useNavigate();
  const [circleSize, setCircleSize] = useState('');
  const [leaderboard, setLeaderboard] = useState<HouseData[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalEvents: 0,
    totalPoints: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCircleSize('w-[500px] h-[500px]');
      else if (width >= 768) setCircleSize('w-[400px] h-[400px]');
      else if (width >= 640) setCircleSize('w-[350px] h-[350px]');
      else setCircleSize('w-[300px] h-[300px]');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHouseClick = (houseName: string) => {
    navigate(`/house/${houseName.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;    
        const response = await fetch(`${API_URL}/fetch_leaderboard.php`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch leaderboard data');
        }

        setLeaderboard(data.data.leaderboard);
        setTopContributors(data.data.topContributors.slice(0, 10));
        setStatistics(data.data.statistics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onViewMore = () => {
    navigate('/leaderboard');
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Combined Hero and Houses Section */}
      <div className="flex flex-col lg:flex-row">
        {/* Hero Section */}
        <section
          ref={heroRef}
          style={{
            marginTop: '14rem',
            // marginLeft: '3rem',
            '--move-x': '0px',
            '--move-y': '0px'
          } as React.CSSProperties}
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-house-aakash/20 rounded-full filter blur-3xl opacity-60 animate-float"
              style={{ transform: 'translate(calc(var(--move-x) * -1.2), calc(var(--move-y) * -1.2))' }}
            />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-house-agni/20 rounded-full filter blur-3xl opacity-60 animate-float"
              style={{ animationDelay: '1s', transform: 'translate(calc(var(--move-x) * 1.5), calc(var(--move-y) * 1.5))' }}
            />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-house-vayu/20 rounded-full filter blur-3xl opacity-60 animate-float"
              style={{ animationDelay: '2s', transform: 'translate(calc(var(--move-x) * 1), calc(var(--move-y) * 1))' }}
            />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6 text-center lg:text-left">
            <div className="max-w-3xl mx-auto lg:mx-0">
              <div className="inline-block animate-fade-in">
                <span className="flex items-center gap-2 text-foreground">
                  <img src={SrkrLogo} alt="SRKR Logo" className="h-10 w-auto" />
                    <span className="text-red-900 font-bold text-lg md:text-xl">SRKREC</span>
                    <span className="text-black-900 font-bold text-sm md:text-base lg:text-lg">
                      <span className="hidden md:inline">CSD & CSIT Department</span>
                      <span className="md:hidden">CSD & CSIT Dept</span>
                    </span>
                </span>
              </div>

              <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
                Where Talent Meets <span className="text-house-aakash">Competition</span>
              </h1>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link
                  to="/pointspage"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Explore Points
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  to="/leaderboard"
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Houses Section */}
        <section className="py-12 lg:py-16 lg:w-1/2  flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className={`relative ${circleSize} mx-auto`}>
              {/* Rotating circle */}
              <div className="absolute inset-0 animate-spin-fast">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255, 0, 0, 0.1)"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Center logo with spinning animation */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-center-logo-spin">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl border border-gray-700 overflow-hidden">
                  <img src={CombineImage} alt="All Houses" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* House logos - positioned absolutely with spinning and orbiting animation */}
              {houses.map((house, index) => {
                const numHouses = houses.length;
                const angle = (index * 360) / numHouses;
                const baseRadius = 80;
                const smRadius = 120;
                const mdRadius = 150;
                const lgRadius = 200;

                const getRadius = () => {
                  const width = window.innerWidth;
                  if (width >= 1024) return lgRadius;
                  if (width >= 768) return mdRadius;
                  if (width >= 640) return smRadius;
                  return baseRadius;
                };

                const currentRadius = getRadius();
                const centerOffset = window.innerWidth < 640 ? 150 : window.innerWidth < 768 ? 175 : window.innerWidth < 1024 ? 200 : 250;
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * currentRadius + centerOffset;
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * currentRadius + centerOffset;

                const iconSize = window.innerWidth < 640 ? 40 : window.innerWidth < 768 ? 50 : 60;
                const buttonSize = window.innerWidth < 640 ? 'w-16 h-16' : window.innerWidth < 768 ? 'w-20 h-20' : 'w-24 h-24';
                const textSmall = window.innerWidth < 640 ? 'text-xs' : window.innerWidth < 768 ? 'text-sm' : 'text-base';

                return (
                  <div
                    key={house.name}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 animate-orbit"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      animationDelay: `-${(numHouses - index) * (10 / numHouses)}s`, // Stagger the orbit start
                    }}
                  >
                    <button
                      onClick={() => handleHouseClick(house.name)}
                      className={`
                        ${buttonSize} rounded-full
                        flex items-center justify-center
                        transition-all duration-300
                        hover:scale-110 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-white/50
                        animate-icon-spin
                      `}
                      style={{ backgroundColor: house.color }}
                    >
                      <img src={house.imageSrc} alt={house.name} className="rounded-full object-cover" style={{ width: iconSize, height: iconSize }} />
                    </button>
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-foreground ${textSmall} whitespace-nowrap`}>
                      {house.name}
                    </div>
                  </div>
                );
              })}

              {/* Rotating connecting lines */}
              <div className="absolute inset-0 animate-spin-slow">
                {houses.map((_, index) => {
                  const numHouses = houses.length;
                  const angle = (index * 360) / numHouses;
                  const lineWidth = window.innerWidth < 640 ? 50 : window.innerWidth < 768 ? 75 : window.innerWidth < 1024 ? 100 : 150;
                  return (
                    <div
                      key={`line-${index}`}
                      className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-gray-600 to-transparent" // Darker gray for lines
                      style={{
                        width: `${lineWidth}px`,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '0 50%',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          
        </section>
        
      </div>
      <div className="text-center">
            <h2 className="text-2xl font-bold">Our Houses</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Every student belongs to one of the five houses. Each house has its own unique
              identity and values.
            </p>
          </div>

      {/* Main Leaderboard */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">House Rankings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {leaderboard.map((house) => {
              const houseName = house.house_name.toLowerCase();
              const validHouse: ValidHouse =
                houseName === 'aakash' ? 'aakash' :
                  houseName === 'agni' ? 'agni' :
                    houseName === 'vayu' ? 'vayu' :
                      houseName === 'jal' ? 'jal' :
                        houseName === 'prudhvi' ? 'prudhvi' : 'aakash';

              return (
                <HouseCard
                  key={house.hid}
                  house={validHouse}
                  points={house.points}
                  rank={house.rank}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-6 border shadow-sm flex items-center">
              <div className="bg-blue-100 rounded-full p-4">
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-6">
                <p className="text-muted-foreground text-sm">Total Events</p>
                <h3 className="text-3xl font-bold">{statistics.totalEvents}</h3>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border shadow-sm flex items-center">
              <div className="bg-red-100 rounded-full p-4">
                <Star className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-6">
                <p className="text-muted-foreground text-sm">Total Points</p>
                <h3 className="text-3xl font-bold">{statistics.totalPoints}</h3>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border shadow-sm flex items-center">
              <div className="bg-green-100 rounded-full p-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-6">
                <p className="text-muted-foreground text-sm">Active Students</p>
                <h3 className="text-3xl font-bold">{statistics.activeStudents}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Students Section */}

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Top Contributors</h2>

          {/* Contributors Table */}
          <div className="bg-background rounded-xl border overflow-hidden">
            <div className="overflow-y-auto max-h-96">
              <table className="w-full">
                <thead className="sticky top-0 bg-secondary">
                  <tr>
                    <th className="px-6 py-4 font-medium text-left">Rank</th>
                    <th className="px-6 py-4 font-medium text-left">Name</th>
                    <th className="px-6 py-4 font-medium text-left">Branch</th>
                    <th className="px-6 py-4 font-medium text-left">Year</th>
                    <th className="px-6 py-4 font-medium text-left">House</th>
                    <th className="px-6 py-4 font-medium text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const sortedContributors = topContributors.sort((a, b) => b.total_points - a.total_points);

                    // Calculate ranks with ties
                    let currentRank = 1;
                    let previousPoints: number | null = null;

                    return sortedContributors.map((contributor, index) => {
                      // Calculate rank
                      if (previousPoints === null || contributor.total_points !== previousPoints) {
                        // Update rank only if points are different
                        currentRank = index + 1;
                      }
                      previousPoints = contributor.total_points;

                      return (
                        <tr
                          key={contributor.user_id}
                          className={`border-t hover:bg-secondary/20 transition-colors ${index >= 5 ? 'hidden sm:table-row' : ''
                            }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">{currentRank}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{contributor.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{contributor.branch}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{contributor.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`house-badge house-badge-${contributor.house_name.toLowerCase()}`}>
                              {contributor.house_name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{contributor.total_points}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
           
            </div>
  <div className="flex justify-center p-4 border-t">
    <button 
      onClick={onViewMore}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
    >
      View More
    </button>
  </div>
           
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseSlow {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes centerLogoSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes iconSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in-out;
  }
  .animate-pulse-slow {
    animation: pulseSlow 2s infinite;
  }
  .animate-spin-slow {
    animation: spin 10s linear infinite;
  }
  .animate-spin-fast {
    animation: spin 5s linear infinite; /* Faster spin for the outer circle */
  }
  .animate-center-logo-spin {
    animation: centerLogoSpin 15s linear infinite;
  }
  .animate-orbit {
    animation: orbit 10s linear infinite;
  }
  .animate-icon-spin {
    animation: iconSpin 8s linear infinite;
  }
`;
