import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login, Home } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
export default App;
