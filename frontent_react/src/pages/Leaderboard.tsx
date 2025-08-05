import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HouseCard } from '@/components/HouseCard';
import { Trophy, Star, Users } from 'lucide-react';

// Static recent achievements data
const recentAchievements = [
  { id: '1', title: 'Hackathon Champions', house: 'aakash', description: 'First place in the Web Development Hackathon', points: 150 },
  { id: '2', title: 'Gaming Tournament Winners', house: 'agni', description: 'Dominated the esports competition', points: 120 },
  { id: '3', title: 'Project Showcase Stars', house: 'vayu', description: 'Best innovative project award', points: 100 }
];

type ValidHouse = 'aakash' | 'agni' | 'vayu' | 'jal' | 'prudhvi';

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

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<HouseData[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalEvents: 0,
    totalPoints: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    house: ''
  });
  const [displayLimit, setDisplayLimit] = useState(5);

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
        setTopContributors(data.data.topContributors);
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.id.replace('-filter', '')]: e.target.value
    });
  };

  const filteredContributors = topContributors.filter(contributor => {
    return (
      (filters.branch === '' || contributor.branch === filters.branch) &&
      (filters.year === '' || contributor.year === filters.year) &&
      (filters.house === '' || contributor.house_name.toLowerCase() === filters.house)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Leaderboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">House Leaderboard</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Track the performance of different houses in various events and competitions.
          </p>
        </div>
      </section>

      {/* Main Leaderboard */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">House Rankings</h2>
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

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Key Statistics</h2>
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

      {/* Top Contributors with Filters */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Top Contributors</h2>

          {/* Filter Controls */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="branch-filter" className="block text-sm font-medium mb-1">
                Branch
              </label>
              <select
                id="branch-filter"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={handleFilterChange}
                value={filters.branch}
              >
                <option value="">All Branches</option>
                <option value="CSD">CSD</option>
                <option value="CSIT-A">CSIT-A</option>
                <option value="CSIT-B">CSIT-B</option>
              </select>
            </div>

            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium mb-1">
                Year
              </label>
              <select
                id="year-filter"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={handleFilterChange}
                value={filters.year}
              >
                <option value="">All Years</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="house-filter" className="block text-sm font-medium mb-1">
                House
              </label>
              <select
                id="house-filter"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={handleFilterChange}
                value={filters.house}
              >
                <option value="">All Houses</option>
                <option value="aakash">Aakash</option>
                <option value="agni">Agni</option>
                <option value="vayu">Vayu</option>
                <option value="jal">Jal</option>
                <option value="prudhvi">Prudhvi</option>
              </select>
            </div>
          </div>

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
                    // Sort contributors by points descending
                    const sortedContributors = [...filteredContributors].sort((a, b) => b.total_points - a.total_points);

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

                      // Display all rows that match filters, limited by displayLimit
                      const isVisible = index < displayLimit; 

                      return (
                        <tr
                          key={contributor.user_id}
                          className={`border-t hover:bg-secondary/20 transition-colors ${!isVisible ? 'hidden sm:table-row' : ''
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

            {/* Show more button for mobile */}
            {filteredContributors.length > displayLimit && (
              <div className="p-4 text-center border-t">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 10)}
                  className="text-primary hover:underline font-medium"
                >
                  Show More Contributors ({filteredContributors.length - displayLimit} more)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Recent Achievements */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-background rounded-xl p-6 border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className={`house-badge house-badge-${achievement.house}`}>
                    {achievement.house.charAt(0).toUpperCase() + achievement.house.slice(1)}
                  </span>
                  <span className="inline-flex items-center bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium">
                    +{achievement.points} points
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}