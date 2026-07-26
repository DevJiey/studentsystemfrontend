import { useState } from "react";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import About from "./pages/About";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const getPageTitle = () => {
    switch (location.pathname) {

      case "/":
        return {
          title: "Dashboard",
          subtitle: "Overview of the system"
        };

      case "/students":
        return {
          title: "Students",
          subtitle: "Manage student records"
        };

      case "/profile":
        return {
          title: "Profile",
          subtitle: "Account information"
        };

      case "/settings":
        return {
          title: "Settings",
          subtitle: "System preferences"
        };

      default:
        return {
          title: "Dashboard",
          subtitle: "Overview of the system"
        };
    }
  };
  const pageInfo = getPageTitle();
  const [showMenu, setShowMenu] = useState(false);
  const isLoginPage =
    location.pathname === "/login";
  if (isLoginPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    );
  }
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

          <div className="header-info">

            <h2>{pageInfo.title}</h2>

            <p>{pageInfo.subtitle}</p>

          </div>

          <div className="user-menu">

            <button
              className="user-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              👤 Admin {showMenu ? "▲" : "▼"}
            </button>

            {showMenu && (
              <div className="dropdown">

                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </button>

                <button
                  onClick={() => {

                    setShowMenu(false);

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
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
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