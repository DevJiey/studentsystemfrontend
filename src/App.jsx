import { useState } from "react";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import About from "./pages/About";

function App() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="layout">

      <aside className="sidebar">
        <div className="logo">
          <h2>STUDENT MS</h2>
          <p>Admin Panel</p>
        </div>

        <NavLink to="/">
          Dashboard
        </NavLink>

        <NavLink to="/students">
          Students
        </NavLink>

        <NavLink to="/about">
          About
        </NavLink>
      </aside>

      <main className="content">

        <div className="topbar">

          <div></div>

          <div className="user-menu">

            <button
              className="user-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              Admin ▼
            </button>

            {showMenu && (
              <div className="dropdown">

                <button
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>

                <button
                  onClick={() => {

                    localStorage.removeItem(
                      "isLoggedIn"
                    );

                    navigate("/login");

                  }}
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>
        <Routes>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login />}
          />

        </Routes>

      </main>

    </div>
  );
}

export default App;