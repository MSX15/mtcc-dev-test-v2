import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/home";
import NoPage from "../pages/no-page";
import Location from "../pages/location";
import Trip from "../pages/trip";
import TripRequest from "../pages/trip-request";
import LoadingPage from "../pages/loading-page";

export default function PageRoutes()
{
    return(
      <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/locations" element={<Location />} />
        <Route path="/trips" element={<Trip />} />
        <Route path="/trip-requests" element={<TripRequest />} />
        <Route path="/loading-page" element={<LoadingPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
    )
}

