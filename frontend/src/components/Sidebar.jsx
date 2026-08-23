import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Intelligence Hub', path: '/intelligence' },
  { label: 'Select Scenario', path: '/scenario' },
  { label: 'Resource Status', path: '/resources' },
  { label: 'Capability Assessment', path: '/capability' },
  { label: 'What-If Simulator', path: '/whatif' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar bg-primary text-white">
      <div className="p-4 border-bottom border-light border-opacity-25">
        <h4 className="fw-bold mb-0">Drishti</h4>
        <small className="text-white-50">DRAA</small>
      </div>
      <nav className="p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 mb-2 ${isActive ? 'active bg-light text-primary' : 'text-white-50'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
