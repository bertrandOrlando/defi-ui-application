import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPages";
import ServiceAssuranceTreeView from "./pages/ServiceAssuranceTreeView";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/service-assurance-tree" element={<ServiceAssuranceTreeView />} />
    </Routes>
  )
}

export default App;
