import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";

export const backendUrl=import.meta.env.VITE_BACKEND_URL;

function App() {
  // use ONE name: token
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);



  // ✅ If no token → only show Login
  if (!token) {
    return (
      <div className="min-h-screen w-screen bg-pink-100 overflow-x-hidden">
        <Login setToken={setToken} />
      </div>
    );
  }

  // ✅ If token exists → show full admin panel
  return (
    <div className="min-h-screen w-screen bg-pink-100 overflow-x-hidden">
      <Navbar setToken={setToken} />

      <Routes>
        <Route path="/" element={<Dashboard token={token}/>} />
        <Route path="/add" element={<Add token={token}/>} />
        <Route path="/list" element={<List token={token}/>} />
        <Route path="/orders" element={<Orders token={token}/>} />
        {/* optional: you usually don't want /login when already logged in */}
       
      </Routes>
    </div>
  );
}

export default App;
