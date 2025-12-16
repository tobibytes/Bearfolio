import { ArrowUpRight, Sparkles } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Showcase', to: '/projects' },
  { label: 'Profile', to: '/profile' },
  { label: 'Sign in', to: '/auth' },
];

const Header = () => {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <span className="brand-mark" />
          <span>Bearfolio Studio</span>
          <span className="pill alt" style={{ marginLeft: 10 }}>
            <Sparkles size={14} />
            new skin
          </span>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/projects">
            <button className="btn ghost">View showcase</button>
          </Link>
          <Link to="/auth">
            <button className="btn primary">
              Launch with Google
              <ArrowUpRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
