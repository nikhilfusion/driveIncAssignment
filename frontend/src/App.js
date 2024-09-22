import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import Reservations from './pages/Reservations';
import Settings from './pages/Settings';
import Vehicles from './pages/Vehicles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="Reservations" element={<Reservations />} />
          <Route path="Vehicles" element={<Vehicles />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;