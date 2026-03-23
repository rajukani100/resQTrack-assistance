
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/AuthLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UserDetails from "./pages/UserDetails";
import ServiceRequests from "./pages/ServiceRequests";
import Competitors from "./pages/Competitors";
import TelegramBot from "./pages/TelegramBot";
import UserProfile from "./pages/UserProfile";
import SalesPipeline from "./pages/SalesPipeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="user-details" element={<UserDetails />} />
              <Route path="service-requests" element={<ServiceRequests />} />
              <Route path="competitors" element={<Competitors />} />
              <Route path="telegram-bot" element={<TelegramBot />} />
              <Route path="profile" element={<UserProfile />} />
          
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
