import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MdLibraryBooks, MdEventSeat, MdPerson, MdDashboard, MdLogout, MdLightMode, MdDarkMode, MdHome } from 'react-icons/md';

const navItems = [
  { path: '/libraries', label: 'Libraries', icon: <MdLibraryBooks size={22} /> },
  { path: '/my-bookings', label: 'Bookings', icon: <MdEventSeat size={22} /> },
  { path: '/admin', label: 'Admin', icon: <MdDashboard size={22} />, adminOnly: true },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNav = navItems.filter(item => !item.adminOnly || user?.role === 'admin');

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-border bg-card z-40">
        <div className="p-6 border-b border-border">
          <h1
            className="text-xl font-bold cursor-pointer"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))' }}
            onClick={() => navigate('/libraries')}
          >
            📚 StudySeat
          </h1>
          <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Book your perfect study spot
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground'
              }`}
              style={location.pathname.startsWith(item.path) ? { color: 'hsl(var(--primary))' } : {}}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <MdPerson size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-destructive/10 transition-colors"
            style={{ color: 'hsl(var(--destructive))' }}
          >
            <MdLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h1
          className="text-lg font-bold cursor-pointer"
          style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))' }}
          onClick={() => navigate('/libraries')}
        >
          📚 StudySeat
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">
            {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-2 rounded-lg hover:bg-destructive/10"
            style={{ color: 'hsl(var(--destructive))' }}
          >
            <MdLogout size={20} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <div className="page-enter">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="bottom-nav lg:hidden flex items-center justify-around py-2">
        {filteredNav.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              location.pathname.startsWith(item.path) ? '' : 'opacity-60'
            }`}
            style={location.pathname.startsWith(item.path) ? { color: 'hsl(var(--primary))' } : {}}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
