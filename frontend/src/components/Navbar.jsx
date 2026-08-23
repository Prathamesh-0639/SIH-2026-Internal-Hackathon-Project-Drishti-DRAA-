import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar d-flex justify-content-between align-items-center px-4 py-3 shadow-sm">
      <div>
        <strong className="d-block">Drishti</strong>
        <span className="badge bg-light text-dark">DRAA</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted">DEOC/EOC</span>
        <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
