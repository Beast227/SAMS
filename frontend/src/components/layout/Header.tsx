import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Bell, Search, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore'; 

export default function Header() {
  const { pathname } = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useAuthStore((state) => state.user); 
  const logout = useAuthStore((state) => state.logout); 

  // Map paths to friendly titles
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard/')) return 'Asset Details';
    switch (path) {
      case '/dashboard': return 'System Overview';
      case '/inventory': return 'Hardware Inventory';
      case '/alerts': return 'Security & Health Alerts';
      case '/reports': return 'Fleet Analytics';
      default: return 'Blera SAMS';
    }
  };

  return (
    <header className="h-16 border-b border-(--color-card-border) bg-(--color-card) px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">

      {/* 1. Left Section: Title & Breadcrumb logic */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-200 leading-none">
          {getPageTitle(pathname)}
        </h1>
        <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">
          Management Console
        </p>
      </div>

      {/* 2. Middle Section: Search (Functional Unit) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-(--color-primary) transition-colors" />
          {/* TODO: Search by what */}
          <input
            type="text"
            placeholder="Search assets by MAC or AssetId"
            className="w-full bg-(--color-panel) border border-(--color-card-border) rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-(--color-primary) transition-all"
          />
        </div>
      </div>

      {/* 3. Right Section: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-(--color-panel) rounded-full transition-colors relative cursor-pointer">
          <Bell size={20} />
          {/* when critical alerts */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-(--color-card)"></span>
        </button>

        {/* Settings (Add MAC Logic Target) */}
        <button className="p-2 text-gray-500 hover:bg-(--color-panel) rounded-full transition-colors cursor-pointer">
          <Settings size={20} />
        </button>

        <div className="h-8 w-px bg-(--color-card-border) mx-1" />

        {/* User Profile + Popup */}
        <div className="relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 group cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              {/* Dynamically populating name from Zustand */}
              <p className="text-sm font-semibold text-gray-400 group-hover:text-gray-300 transition-colors capitalize">
                {user?.username || 'Admin'}
              </p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">System Mgr</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-(--color-sec) to-(--color-primary) flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
              <User size={18} />
            </div>
          </div>

          {/* Profile Popup */}
          {isProfileOpen && (
            <>
              {/* Invisible overlay to close when clicking outside */}
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>

              <div className="absolute right-0 mt-3 w-56 bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-(--color-card-border) mb-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-100 truncate">{user?.username || "Admin"}</p>
                </div>

                <button
                  onClick={() => { logout(); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}