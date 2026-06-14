import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FrequencyWaveBackground } from "@/components/FrequencyWaveBackground";
import { HertzShaderBackground } from "@/components/HertzShaderBackground";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import Regions from "./pages/Regions";
import Premium from "./pages/Premium";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Podcasts from "./pages/Podcasts";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Index />
          </motion.div>
        } />
        <Route path="/favorites" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Favorites />
          </motion.div>
        } />
        <Route path="/regions" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Regions />
          </motion.div>
        } />
        <Route path="/premium" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Premium />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Profile />
          </motion.div>
        } />
        <Route path="/podcasts" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Podcasts />
          </motion.div>
        } />
        <Route path="/rewards" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Rewards />
          </motion.div>
        } />
        <Route path="/terms" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Terms />
          </motion.div>
        } />
        <Route path="/privacy" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Privacy />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <PlayerProvider>
          <HertzShaderBackground />
          <FrequencyWaveBackground zIndex={1} />
          <div className="fixed inset-0 z-[2] pointer-events-none bg-dot-grid" />
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AnimatedRoutes />
          </BrowserRouter>
        </PlayerProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
