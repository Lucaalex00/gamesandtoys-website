import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Info from "./pages/Info";
import Navbar from "./components/NavbarComponent";
import RequireAuth from "./components/RequireAuthComponent";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Navbar separata */}
      <Navbar location={location} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/info" element={<Info />} />

          {/* PRIVATE ROUTES */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
        />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Events />
              </RequireAuth>
            }
          />
        </Routes>
    </div>
  );
}

export default App;
