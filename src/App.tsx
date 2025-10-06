import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPages";
import LoginPage from "./pages/LoginPage";
import VendorManagement from "./pages/VendorManagement";
import ServiceAssurance from "./pages/ServiceAssurance";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
            <h1>vendor-agreement-query Page</h1>
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
            <h1>vendor-communication Page</h1>{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/policy-configuration"
        element={
          <ProtectedRoute>
            <h1>policy-configuration Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <h1>user-management Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/network-planning"
        element={
          <ProtectedRoute>
            <h1>network-planning Page</h1>
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
        path="/inventory"
        element={
          <ProtectedRoute>
            <h1>inventory Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/network-configuration"
        element={
          <ProtectedRoute>
            <h1>network-configuration Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-flow-design"
        element={
          <ProtectedRoute>
            <h1>service-flow-design Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reporting-analytics"
        element={
          <ProtectedRoute>
            <h1>reporting-analytics Page</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <h1>notifications Page</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
