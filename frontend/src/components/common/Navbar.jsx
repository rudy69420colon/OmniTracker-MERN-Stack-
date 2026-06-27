import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, User, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <CheckSquare size={22} className="brand-icon" />
        <span>TaskTracker</span>
      </div>

      {user && (
        <div className="navbar-actions">
          <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="user-badge">
            <User size={15} />
            <span>{user.name}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
