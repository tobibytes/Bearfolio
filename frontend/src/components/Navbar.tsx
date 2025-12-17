import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { Avatar } from './Avatar';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-brand to-sky-500" />
          Bearfolio
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'text-ink' : '')}>
            Home
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'text-ink' : '')}>
            Students
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'text-ink' : '')}>
            Projects
          </NavLink>
          <NavLink to="/opportunities" className={({ isActive }) => (isActive ? 'text-ink' : '')}>
            Opportunities
          </NavLink>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100">
                <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                <span className="text-sm font-semibold clamp-1">{user.name}</span>
              </Link>
              <Link to="/profile/edit" className="text-sm font-semibold text-brand hover:underline">
                Edit profile
              </Link>
              <button
                onClick={handleSignOut}
                className="button-focus inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/signin">
              <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand">
                <LogIn size={16} />
                Sign in
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
