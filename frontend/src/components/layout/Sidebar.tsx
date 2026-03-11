import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Monitor,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { pathname } = useLocation();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Monitor },
    { label: 'Alert Logs', path: '/alerts', icon: Bell },
  ];

  const secondaryNav = [
    { label: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <aside
      className={`h-screen flex flex-col border-r border-(--color-card-border) bg-(--color-card) transition-all duration-300 ease-in-out shadow-sm
      ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* 1. Header: Logo & Minimize Toggle */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-(--color-card-border)">
        <div className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed && (
            <img src='/blera_logo.png' width={"95%"}/>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-(--color-panel) text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* 2. Main Navigation Area */}
      <div className="flex-1 py-6 flex flex-col justify-between overflow-x-hidden">

        {/* Top Group */}
        <nav className="px-3 space-y-1">
          {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>}
          {mainNav.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ?"justify-center":""} gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                  ${isActive
                    ? 'bg-(--color-primary) text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-500 hover:bg-(--color-panel) hover:text-gray-400'}`}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Group - Analytics */}
        <div className="px-3 space-y-1">
          {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Analytics</p>}
          {secondaryNav.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                   ${isActive
                    ? 'bg-(--color-primary) text-white'
                    : 'text-gray-500 hover:bg-(--color-panel) hover:text-gray-400'}`}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}