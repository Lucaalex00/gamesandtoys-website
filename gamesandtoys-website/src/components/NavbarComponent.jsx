import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = ({ location }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-transparent shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6 justify-between">
        <div className="flex w-1/2 justify-around">
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

        <div className="flex gap-5 w-1/2 justify-end">
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
