import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Countries from "./pages/Countries";
import Profile from "./pages/Profile";
import PassportPage from "./pages/PassportPage";
import AuthPage from "./pages/AuthPage";

import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected */}
          <Route
            path="/countries"
            element={
              <RequireAuth>
                <Countries />
              </RequireAuth>
            }
          />
          <Route
            path="/passport"
            element={
              <RequireAuth>
                <PassportPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
