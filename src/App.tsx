import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPages";
import VendorManagement from "./pages/VendorManagement";


function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<LandingPage />}/>
      <Route path="/login" element={<h1>Login Page</h1>}/>
      <Route path="/register" element={<h1>Register Page</h1>}/>

      <Route path="/vendor-agreement-query" element={<h1>vendor-agreement-query Page</h1>}/>
      <Route path="/vendor-management" element={<VendorManagement />}/>
      <Route path="/vendor-communication" element={<h1>vendor-communication Page</h1>}/>
      <Route path="/policy-configuration" element={<h1>policy-configuration Page</h1>}/>
      <Route path="/user-management" element={<h1>user-management Page</h1>}/>
      <Route path="/network-planning" element={<h1>network-planning Page</h1>}/>
      <Route path="/service-assurance" element={<h1>service-assurance Page</h1>}/>
      <Route path="/inventory" element={<h1>inventory Page</h1>}/>
      <Route path="/network-configuration" element={<h1>network-configuration Page</h1>}/>
      <Route path="/service-flow-design" element={<h1>service-flow-design Page</h1>}/>
      <Route path="/reporting-analytics" element={<h1>reporting-analytics Page</h1>}/>
      <Route path="/notifications" element={<h1>notifications Page</h1>}/>
    </Routes>
  )
}

export default App;
