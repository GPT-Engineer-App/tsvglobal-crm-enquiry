import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from 'next-themes';
import Index from "./pages/Index";
import Login from "./pages/Login";
import ErrorBoundary from "./components/ErrorBoundary";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
