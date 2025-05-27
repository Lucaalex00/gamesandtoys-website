import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/NavbarComponent";
import RequireAuth from "./components/RequireAuthComponent";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3b2f2f] via-[#7a5230] to-[#b7874a]">
      {/* Navbar separata */}
      <Navbar location={location} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE ROUTES */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
    </div>
  );
}

export default App;
