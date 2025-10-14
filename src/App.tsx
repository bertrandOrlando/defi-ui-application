import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPages";
import LoginPage from "./pages/LoginPage";
import VendorManagement from "./pages/VendorManagement";
import ServiceAssurance from "./pages/ServiceAssurance";
import SummaryDashboard from "./pages/SummaryDashboard";
import AlarmGraph from "./pages/AlarmDetailsCharts";
import ProtectedRoute from "./component/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import RootHandler from "./pages/RootHandler";
import UserManagement from "./pages/UserManagement";
import OutOfScope from "./pages/OutOfScope";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootHandler />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/performance-details" element={<PerformanceDetails />} />
      <Route path="/register" element={<h1>Register Page</h1>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor-agreement-query"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Vendor Agreement Query Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor-management"
        element={
          <ProtectedRoute>
            <VendorManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor-communication"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Vendor Communication Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policy-configuration"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Policy Configuration Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/network-planning"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Network Planning Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-assurance"
        element={
          <ProtectedRoute>
            <ServiceAssurance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-assurance/dashboard"
        element={
          <ProtectedRoute>
              <SummaryDashboard/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/system"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="system"/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Inventory Page" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alarm-graph"
        element={
          <ProtectedRoute>
            <AlarmGraph />
          </ProtectedRoute>
        }
      />

      <Route
        path="/network-configuration"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Network Configuration Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-flow-design"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Service Flow Design Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reporting-analytics"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Reporting Analytics Page" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <OutOfScope pageName="Notifications Page" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
