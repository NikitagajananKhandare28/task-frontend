import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Tasks
      </Link>
      <nav className="navbar-links">
        {token ? (
          <>
            <Link to="/tasks">My tasks</Link>
            <Link to="/tasks/new">New task</Link>
            <span className="navbar-user">{user?.email}</span>
            <button type="button" className="btn btn-ghost btn-small" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
