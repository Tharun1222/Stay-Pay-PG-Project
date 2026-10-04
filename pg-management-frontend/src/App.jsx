import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Facilities from "./Pages/Facilities";
import Rooms from "./Pages/Rooms";
import Enquiry from "./Pages/Enquiry";
import FoodTrial from "./Pages/FoodTrial";
import NearbyPG from "./Pages/NearbyPG";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";

function AdminRoute({ children }) {
  return sessionStorage.getItem("adminToken")
    ? children
    : <Navigate to="/admin-login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nearby" element={<NearbyPG />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/food-trial" element={<FoodTrial />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}