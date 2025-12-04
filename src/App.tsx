
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
    
    const trackVisitor = async () => {
      const currentVisitorKey = 'current_visitor_id';
      let visitorId = localStorage.getItem(currentVisitorKey);
      
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(currentVisitorKey, visitorId);
      }
      
      try {
        await fetch('https://functions.poehali.dev/5f9188b6-402c-4246-8a5e-f5de87370a31', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitor_id: visitorId,
          }),
        });
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };
    
    trackVisitor();
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