import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import PointsPage  from "./pages/PointsPage";
import HousePage from "./pages/HousePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/pointspage" element={<PointsPage />} />
          <Route path="/house/:houseName" element={<HousePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
     
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
