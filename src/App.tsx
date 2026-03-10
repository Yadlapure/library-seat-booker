import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LibrariesPage from "./pages/LibrariesPage";
import FloorsPage from "./pages/FloorsPage";
import SeatLayoutPage from "./pages/SeatLayoutPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import PaymentPage from "./pages/PaymentPage";
import QRCodePage from "./pages/QRCodePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/libraries" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/libraries" element={<ProtectedRoute><LibrariesPage /></ProtectedRoute>} />
    <Route path="/library/:libraryId/floors" element={<ProtectedRoute><FloorsPage /></ProtectedRoute>} />
    <Route path="/seats/:floorId" element={<ProtectedRoute><SeatLayoutPage /></ProtectedRoute>} />
    <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
    <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
    <Route path="/qr/:bookingId" element={<ProtectedRoute><QRCodePage /></ProtectedRoute>} />
    <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/" element={<Navigate to="/libraries" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
