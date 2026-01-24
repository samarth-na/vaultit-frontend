import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiRequest } from "./lib/api";
import Login from "./pages/signin";
import Home from "./pages/home";

type User = {
  id: string;
  email: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMe() {
      try {
        const res = await apiRequest("/me");

        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkMe();
  }, []);

  if (loading) {
    return <p className="p-4 text-cyan-500 font-serif ">Loading...</p>;
  }

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected home route */}
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
