// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/Pages/Home";
import AccidentAlert from "../src/pages/Accident-alert";
import TowVehicleAlert from "../src/pages/Tow-vehicle-alert";


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accident-alert" element={<AccidentAlert />} />
          <Route path="/tow-vehicle-alert" element={<TowVehicleAlert />} />
          
        </Routes>
      </div>
    </Router>
  );
}