import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import React, { useState } from "react";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ScholarStat" element={<Home/>} />
      </Routes>
    </Router>
  );
};

export default App;