import React from 'react';
import logo from './logo.svg';
import './App.css';
import dayjs from 'dayjs'
import PageRoutes from './routes/routes';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from "react-router-dom";


function App() {
  return (
    <PageRoutes />
  );
}

export default App;
