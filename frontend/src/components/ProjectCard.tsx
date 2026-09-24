import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
];

type SidebarProps = {
  username: string;
  onLogout: () => void;
};

export default function Sidebar({ username, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">W</div>
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Project Hub</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-panel">
        <div className="avatar">{username[0]?.toUpperCase() || 'U'}</div>
        <div>
          <strong>{username}</strong>
          <small>Product lead</small>
        </div>
      </div>

      <button className="logout-button" onClick={onLogout}>Log out</button>
    </aside>
  );
}
