import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = ({ location }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`shadow-md sticky top-0 z-10 transition-colors duration-300 ${scrolled ? 'bg-black' : 'bg-transparent'}`}>
      <div className="max-w-7xl sm:justify-between mx-auto px-6 py-4 flex gap-3 justify-between">
        <div className="flex justify-around w-2/3">
          {[
            { path: '/', label: 'Home' },
            { path: '/events', label: 'Eventi' },
            { path: '/info', label: 'Info' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition hover:text-orange-500 ${
                location.pathname === link.path ? 'text-orange-500' : 'text-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-2 w-1/2 justify-end">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="font-semibold text-yellow-500">
                Profilo
              </Link>
              <button onClick={handleLogout} className="text-red-400 cursor-pointer font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-yellow-300 hover:text-yellow-600">
                Login
              </Link>
              <Link to="/register" className="font-semibold text-yellow-300 hover:text-yellow-600">
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
