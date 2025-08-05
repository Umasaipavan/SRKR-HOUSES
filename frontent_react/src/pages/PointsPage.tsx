import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Interface for main contributor data
interface Contributor {
  user_id: number;
  name: string;
  username: string;
  branch: string;
  year?: string;
  house_name: string;
  participant_points: number;
  organizer_points: number;
  winner_points: number;
  total_points: number;
}

// Interface for event details
interface EventDetail {
  event_id: number;
  title: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  image_path: string;
  participate_points: number;
  winner_points: number;
  organiser_points: number;
  earned_points: number;
}

// Interface for point details categories
interface PointDetailsData {
  participated: {
    type: string;
    count: number;
    events: EventDetail[];
  };
  won: {
    type: string;
    count: number;
    events: EventDetail[];
  };
  organized: {
    type: string;
    count: number;
    events: EventDetail[];
  };
}

// Interface for the complete point details response
interface PointDetailsResponse {
  status: string;
  user_id: number;
  data: PointDetailsData;
  timestamp: string;
}

const PointsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [search, setSearch] = useState<string>("");
  const [house, setHouse] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [pointDetails, setPointDetails] = useState<PointDetailsData | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/fetch_points.php`);
      console.log("API Response:", response.data); // Debugging
      // Handle the expected data format
      if (response.data && Array.isArray(response.data.data)) {
        setContributors(response.data.data);
      } else if (response.data?.data?.topContributors && Array.isArray(response.data.data.topContributors)) {
        // Alternative format
        setContributors(response.data.data.topContributors);
      } else {
        setError("Invalid data format received.");
      }
    } catch (error) {
      console.error("Error fetching contributors:", error);
      setError("Failed to fetch contributors.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPointDetails = async (userId: string) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL;    
      const response = await axios.get<PointDetailsResponse>(
        `${API_URL}/fetch_pointsberify.php?user_id=${userId}`
      );

      if (response.data && response.data.status === "success" && response.data.data) {
        setPointDetails(response.data.data);
      } else {
        setDetailsError("Invalid data format received from point details API.");
        setPointDetails(null);
      }
    } catch (error) {
      console.error("Error fetching point details:", error);
      setDetailsError("Failed to fetch point details.");
      setPointDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRowClick = (userId: number) => {
    if (expandedRow === userId) {
      // If clicking on the already expanded row, collapse it
      setExpandedRow(null);
      setPointDetails(null);
    } else {
      // Expand the row and fetch details
      setExpandedRow(userId);
      fetchUserPointDetails(userId.toString());
    }
  };

  // Get unique branches for the dropdown
  const uniqueBranches = Array.from(new Set(contributors.map((contributor) => contributor.branch))).sort();

  const filteredContributors = contributors.filter((contributor) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      contributor.name.toLowerCase().includes(searchLower) ||
      contributor.username.toLowerCase().includes(searchLower) ||
      contributor.branch.toLowerCase().includes(searchLower) ||
      contributor.house_name.toLowerCase().includes(searchLower) ||
      contributor.participant_points.toString().includes(searchLower) ||
      contributor.organizer_points.toString().includes(searchLower) ||
      contributor.winner_points.toString().includes(searchLower) ||
      contributor.total_points.toString().includes(searchLower);

    const matchesHouse = house === "All" || contributor.house_name.toLowerCase() === house.toLowerCase();
    const matchesBranch = branch === "All" || contributor.branch.toLowerCase() === branch.toLowerCase();

    return matchesSearch && matchesHouse && matchesBranch;
  });

  // Pagination logic
  const totalItems = filteredContributors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContributors = filteredContributors.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
        <div className="min-h-screen flex flex-col">

      <Navbar />

      <section className="pt-32 pb-12 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">Points</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Here you can view the points of all the contributors.On-clicking on name will show you the events they have participated in, won, and organized.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">


          {/* Search and Filter Section */}
          <div className="w-full flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            {/* House Filter Dropdown */}
            <select
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Houses</option>
              <option value="Aakash">Aakash</option>
              <option value="Agni">Agni</option>
              <option value="Vayu">Vayu</option>
              <option value="Jal">Jal</option>
              <option value="Prudhvi">Prudhvi</option>
            </select>

            {/* Branch Filter Dropdown */}
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Branches</option>
              {uniqueBranches.map((branchOption) => (
                <option key={branchOption} value={branchOption}>
                  {branchOption}
                </option>
              ))}
            </select>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            {loading ? (
              <p className="text-center py-6 text-gray-900 dark:text-white">Loading contributors...</p>
            ) : error ? (
              <p className="text-center py-6 text-red-500">{error}</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                    <tr>
                      <th className="px-4 py-3 left-0 bg-gray-100 dark:bg-gray-700 z-10">Name</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Total Points</th>
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">House</th>
                      <th className="px-4 py-3">Participant</th>
                      <th className="px-4 py-3">Organizer</th>
                      <th className="px-4 py-3">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {currentContributors.length > 0 ? (
                      currentContributors.map((contributor, index) => (
                        <React.Fragment key={contributor.user_id}>
                          <tr
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${expandedRow === contributor.user_id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                            onClick={() => handleRowClick(contributor.user_id)}
                          >
                            <td className="px-4 py-3 left-0 bg-white dark:bg-gray-800 z-10 flex items-center space-x-2">
                              <span className="text-gray-500 dark:text-gray-400">{startIndex + index + 1}</span>
                              <span className="font-semibold">{contributor.name}</span>
                            </td>
                            <td className="px-4 py-3">{contributor.username}</td>
                            <td className="px-4 py-3 font-semibold">{contributor.total_points}</td>
                            <td className="px-4 py-3">{contributor.branch}</td>
                            <td className="px-4 py-3">{contributor.year || 'N/A'}</td>
                            <td className="px-4 py-3">{contributor.house_name}</td>
                            <td className="px-4 py-3">{contributor.participant_points}</td>
                            <td className="px-4 py-3">{contributor.organizer_points}</td>
                            <td className="px-4 py-3">{contributor.winner_points}</td>
                          </tr>
                          {expandedRow === contributor.user_id && (
                            <tr>
                              <td colSpan={9} className="px-4 py-4 bg-gray-50 dark:bg-gray-700">
                                {detailsLoading ? (
                                  <div className="flex justify-center py-8">
                                    <div className="animate-pulse text-center">
                                      <p className="text-gray-500 dark:text-gray-400">Loading point details...</p>
                                    </div>
                                  </div>
                                ) : detailsError ? (
                                  <div className="text-center py-4">
                                    <p className="text-red-500">{detailsError}</p>
                                  </div>
                                ) : pointDetails ? (
                                  <div className="space-y-8">
                                    {/* Participation Events */}
                                    {pointDetails.participated.count > 0 && (
                                      <div>
                                        <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                                          Participation Events ({pointDetails.participated.count})
                                        </h3>
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-sm">
                                            <thead>
                                              <tr className="bg-gray-100 dark:bg-gray-600">
                                                <th className="px-3 py-2 text-left">Event Name</th>
                                                <th className="px-3 py-2 text-left">Date</th>
                                                <th className="px-3 py-2 text-left">Venue</th>
                                                <th className="px-3 py-2 text-left">Points Earned</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {pointDetails.participated.events.map((event, i) => (
                                                <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
                                                  <td className="px-3 py-2 font-medium">{event.title}</td>
                                                  <td className="px-3 py-2">{formatDate(event.event_date)}</td>
                                                  <td className="px-3 py-2">{event.venue}</td>
                                                  <td className="px-3 py-2">{event.earned_points}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}

                                    {/* Winner Events */}
                                    {pointDetails.won.count > 0 && (
                                      <div>
                                        <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                                          Winner Events ({pointDetails.won.count})
                                        </h3>
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-sm">
                                            <thead>
                                              <tr className="bg-gray-100 dark:bg-gray-600">
                                                <th className="px-3 py-2 text-left">Event Name</th>
                                                <th className="px-3 py-2 text-left">Date</th>
                                                <th className="px-3 py-2 text-left">Venue</th>
                                                <th className="px-3 py-2 text-left">Points Earned</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {pointDetails.won.events.map((event, i) => (
                                                <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
                                                  <td className="px-3 py-2 font-medium">{event.title}</td>
                                                  <td className="px-3 py-2">{formatDate(event.event_date)}</td>
                                                  <td className="px-3 py-2">{event.venue}</td>
                                                  <td className="px-3 py-2">{event.earned_points}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}

                                    {/* Organizer Events */}
                                    {pointDetails.organized.count > 0 && (
                                      <div>
                                        <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                                          Organized Events ({pointDetails.organized.count})
                                        </h3>
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-sm">
                                            <thead>
                                              <tr className="bg-gray-100 dark:bg-gray-600">
                                                <th className="px-3 py-2 text-left">Event Name</th>
                                                <th className="px-3 py-2 text-left">Date</th>
                                                <th className="px-3 py-2 text-left">Venue</th>
                                                <th className="px-3 py-2 text-left">Points Earned</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {pointDetails.organized.events.map((event, i) => (
                                                <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
                                                  <td className="px-3 py-2 font-medium">{event.title}</td>
                                                  <td className="px-3 py-2">{formatDate(event.event_date)}</td>
                                                  <td className="px-3 py-2">{event.venue}</td>
                                                  <td className="px-3 py-2">{event.earned_points}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}

                                    {/* Message when no events exist in any category */}
                                    {pointDetails.participated.count === 0 &&
                                     pointDetails.won.count === 0 &&
                                     pointDetails.organized.count === 0 && (
                                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No event participation records found for this user.
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No point details available.
                                  </p>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                          No contributors available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Component */}
          {totalItems > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 w-full mt-4 rounded-lg shadow">
              {/* Mobile View */}
              <div className="flex flex-1 justify-between sm:hidden space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="relative inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                  className="relative inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="size-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0"
                        }`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Ellipsis if there are more pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 ring-inset focus:outline-offset-0">
                        ...
                      </span>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="size-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
      <Footer />
      </div>
      </section>
    </div>
    </>
  );
};

export default PointsPage;
