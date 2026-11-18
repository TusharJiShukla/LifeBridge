import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, User, LogOut, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-rose-600 font-bold text-xl tracking-tight">
              <span className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-600" />
              </span>
              <span className="text-slate-900">Life<span className="text-rose-600">Bridge</span></span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-1">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition"
              >
                Home
              </Link>
              <Link
                to="/matches"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Explore Matches</span>
              </Link>
              <Link
                to="/register/donor"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition"
              >
                Become a Donor
              </Link>
              <Link
                to="/register/recipient"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition"
              >
                Request Organ
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition text-sm font-semibold border border-rose-200"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard ({user.role === 'donor' ? 'Donor' : 'Recipient'})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register/donor"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                >
                  Pledge Organ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
