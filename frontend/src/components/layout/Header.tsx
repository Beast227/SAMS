import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Search, LogOut, Cpu, X, Plus, Trash2, AlertCircle, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Header() {
  const { pathname } = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for the Modal
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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

      {/* 1. Left Section */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-200 leading-none">
          {getPageTitle(pathname)}
        </h1>
        <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">
          Management Console
        </p>
      </div>

      {/* 2. Middle Section: Search */}
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

      {/* 3. Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative group/tooltip flex items-center justify-center">

          <button className="p-2 text-gray-500 hover:bg-(--color-panel) rounded-full transition-colors relative cursor-pointer">
            <Bell size={20} />
            {/* Red Dot indicator only if present: TODO*/}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-(--color-card)"></span>
          </button>

          <span className="absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-[10px] font-medium rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Critical Alerts Detected
          </span>
        </div>

        {/* Settings with Tooltip */}
        <div className="relative group/tooltip">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-500 hover:bg-(--color-panel) rounded-full transition-colors cursor-pointer"
          >
            <PlusCircle size={20} />
          </button>

          {/* Tooltip text */}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Register device through MAC address
          </span>
        </div>

        <div className="h-8 w-px bg-(--color-card-border) mx-1" />

        {/* User Profile */}
        <div className="relative">
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="text-right hidden sm:block">
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
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-(--color-card-border) mb-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-100 truncate">{user?.username || "Admin"}</p>
                </div>
                <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- Configure MAC Modal --- */}
      {isSettingsOpen && (
        <MacWhitelistModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </header>
  );
}

// Sub-component for the Modal to keep the Header clean

// Regex for standard MAC address (XX:XX:XX:XX:XX:XX)
const MAC_REGEX = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;

function MacWhitelistModal({ onClose }: { onClose: () => void }) {
  const [macs, setMacs] = useState<string[]>(() => {
    const saved = localStorage.getItem('blera_mac_draft');
    return saved ? JSON.parse(saved) : [''];
  });

  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    const validMacs = macs.filter(mac => MAC_REGEX.test(mac.trim()));
    if (validMacs.length > 0) {
      localStorage.setItem('blera_mac_draft', JSON.stringify(validMacs));
    } else {
      localStorage.removeItem('blera_mac_draft');
    }
  }, [macs]);

  // Validate a single MAC, update errors state, and check duplicates
  const validateMacField = (index: number, value: string) => {
    const val = value.toUpperCase().trim();
    const newMacs = [...macs];
    newMacs[index] = val;
    setMacs(newMacs);

    // Invalid if regex fails or duplicate exists in the array
    const isInvalid = !MAC_REGEX.test(val) || newMacs.filter(m => m === val).length > 1;

    setErrors((prev) => {
      if (isInvalid && !prev.includes(index)) return [...prev, index];
      if (!isInvalid && prev.includes(index)) return prev.filter((i) => i !== index);
      return prev;
    });
  };

  // Check all MACs and return indices of invalid or duplicate ones
  const getInvalidMacIndices = () => {
    const counts: Record<string, number> = {};
    return macs
      .map((mac, idx) => {
        const val = mac.trim().toUpperCase();
        counts[val] = (counts[val] || 0) + 1;
        if (!MAC_REGEX.test(val) || counts[val] > 1) return idx;
        return -1;
      })
      .filter(idx => idx !== -1);
  };

  const validateAndSave = () => {
    const newErrors = getInvalidMacIndices();
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Call to backend with list of mac address

    localStorage.removeItem('blera_mac_draft');
    console.log("Saving valid MACs to API:", macs);
    onClose();
  };

  const addAnotherDevice = () => {
    const newErrors = getInvalidMacIndices();
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setMacs([...macs, '']);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-(--color-card-border) flex justify-between items-center bg-gray-900/20">
          <div className="flex items-center gap-2 text-gray-200">
            <Cpu size={18} className="text-(--color-primary)" />
            <span className="font-bold">Add Device MAC Address</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[10px] text-gray-400 mb-2">
            Want to manage registered devices?{" "}
            <Link to="/inventory" className="text-(--color-primary) hover:underline" onClick={onClose}>
              Click here
            </Link>
          </p>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {macs.map((mac, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <input
                    value={mac}
                    onChange={(e) => validateMacField(i, e.target.value)}
                    placeholder="00:1A:2B:3C:4D:5E"
                    className={`flex-1 bg-(--color-panel) border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none transition-all font-mono ${errors.includes(i)
                      ? 'border-red-500 ring-1 ring-red-500/20'
                      : 'border-(--color-card-border) focus:border-(--color-primary)'
                      }`}
                  />
                  {macs.length > 1 && (
                    <button
                      onClick={() => setMacs(macs.filter((_, idx) => idx !== i))}
                      className="text-red-500/50 hover:text-red-500 p-2 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {errors.includes(i) && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1 ml-1">
                    <AlertCircle size={10} /> Invalid/Repeated MAC address
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addAnotherDevice}
            className="mt-4 w-full py-2 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={14} /> Add Another Device
          </button>

          <button
            onClick={validateAndSave}
            className="mt-6 w-full py-2.5 bg-linear-to-r from-(--color-primary) to-(--color-sec) text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Register Device
          </button>
        </div>
      </div>
    </div>
  );
}