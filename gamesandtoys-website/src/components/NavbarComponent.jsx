import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, userName, /* userCredito */ } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { path: '/events', label: 'Eventi' },
    { path: '/info', label: 'Info' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? 'bg-black/90' : 'bg-black/90'
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 sm:py-5">
        {/* Logo */}
        <Link to="/" className="w-32">
          <img
            src="https://via.placeholder.com/150x40?text=Logo"
            alt="Logo"
            className="object-contain w-full h-auto transition-opacity duration-700 opacity-90 hover:opacity-100"
          />
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-12 w-full">
          {navLinks.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <div key={path} className="relative group overflow-visible">
                <Link
                  to={path}
                  className={`font-semibold text-lg transition-colors duration-300
                    ${
                      isActive
                        ? 'text-[#d9822b]'
                        : 'text-[#f3e6d8] hover:text-[#ff9c3a] hover:translate-x-1'
                    }`}
                >
                  {label}
                </Link>
                {/* Underline animata con bottom 0 */}
                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[3px] bg-[#ff9c3a] rounded-full w-full transition-all duration-300"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="flex space-x-8 w-1/3 justify-end items-center">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="font-semibold text-[#d9822b]">
                {userName || "Profilo" } 
              </Link>
              <button
                onClick={handleLogout}
                className="font-semibold text-red-500 hover:text-red-600 transition-transform duration-300 hover:scale-110 hover:-translate-x-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-semibold text-[#d9822b] hover:text-[#ff9c3a] transition-transform duration-300 hover:scale-110 hover:translate-x-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-semibold text-[#d9822b] hover:text-[#ff9c3a] transition-transform duration-300 hover:scale-110 hover:translate-x-1"
              >
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
