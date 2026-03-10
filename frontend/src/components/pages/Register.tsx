import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import { useRegisterMutation } from '../../hooks/useAuth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useRegisterMutation();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--background) p-4">
      <div className="w-full max-w-md bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-xl overflow-hidden">

        <div className="p-8 pb-0 flex flex-col items-center">
          <div className="p-8 pb-0">
            <img src='/blera_logo.png' width={"95%"} alt="Blera Logo" />
          </div>
          <p className="text-gray-500 text-sm mt-1">Register for Blera SAMS</p>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Choose Username</label>
            <div className="relative group">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin_01"
                className="w-full bg-(--color-panel) border border-(--color-card-border) rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Secure Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-(--color-panel) border border-(--color-card-border) rounded-xl py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            label="Create Account"
            icon={UserPlus}
            isLoading={registerMutation.isPending}
            className="shadow-md shadow-blue-500/10"
          />
        </form>

        <div className="p-4 border-t border-(--color-card-border) text-center">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            Already have an account?{' '}
            <Link to="/login" className="text-(--color-primary) font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}