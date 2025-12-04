
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WriteWish from "./pages/WriteWish";
import Wishes from "./pages/Wishes";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Track unique visitors
    const visitorsKey = 'site_visitors';
    const currentVisitorKey = 'current_visitor_id';
    
    let visitorId = localStorage.getItem(currentVisitorKey);
    
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(currentVisitorKey, visitorId);
      
      const visitors = JSON.parse(localStorage.getItem(visitorsKey) || '[]');
      visitors.push({
        id: visitorId,
        firstVisit: Date.now(),
        lastVisit: Date.now(),
      });
      localStorage.setItem(visitorsKey, JSON.stringify(visitors));
    } else {
      const visitors = JSON.parse(localStorage.getItem(visitorsKey) || '[]');
      const visitorIndex = visitors.findIndex((v: any) => v.id === visitorId);
      if (visitorIndex !== -1) {
        visitors[visitorIndex].lastVisit = Date.now();
        localStorage.setItem(visitorsKey, JSON.stringify(visitors));
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write-wish" element={<WriteWish />} />
            <Route path="/wishes" element={<Wishes />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;