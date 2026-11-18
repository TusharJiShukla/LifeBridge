import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Users, Activity, Sparkles, ArrowRight, ShieldCheck, MapPin, Search } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableDonors: 0,
    totalRecipients: 0,
    waitingRecipients: 0,
  });

  // Quick match form state
  const [organ, setOrgan] = useState('Kidney');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [city, setCity] = useState('');

  useEffect(() => {
    api.getSummary()
      .then(setStats)
      .catch((err) => console.log('Summary load notice (backend might be starting):', err.message));
  }, []);

  const handleQuickMatch = (e) => {
    e.preventDefault();
    navigate(`/matches?organ=${organ}&bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50 py-16 md:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Biological Matching System</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bridging the Gap Between <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">
                Pledged Donors & Waiting Lives
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A transparent, rule-based matching platform that compares organ availability, 
              biological blood group compatibility, urgency, and proximity in real-time.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                to="/register/donor"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-rose-600 text-white font-semibold shadow-md shadow-rose-200 hover:bg-rose-700 hover:shadow-lg transition gap-2"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Pledge to Donate</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/register/recipient"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition gap-2"
              >
                <Activity className="w-5 h-5" />
                <span>Register Organ Request</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <p className="text-3xl font-extrabold text-rose-600">{stats.availableDonors || '4+'}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Available Donors</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{stats.waitingRecipients || '3+'}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Waiting Patients</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <p className="text-3xl font-extrabold text-emerald-600">100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">ABO Blood Rule Check</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <p className="text-3xl font-extrabold text-amber-600">0 - 100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Weighted Compatibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Match Finder */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Live Search</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Instant Compatibility Check</h2>
            <p className="text-sm text-slate-600">
              Test organ and blood compatibility against currently registered donors in real-time.
            </p>
          </div>

          <form onSubmit={handleQuickMatch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Organ Needed</label>
              <select
                value={organ}
                onChange={(e) => setOrgan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Kidney">Kidney</option>
                <option value="Liver">Liver</option>
                <option value="Heart">Heart</option>
                <option value="Cornea">Cornea</option>
                <option value="Lungs">Lungs</option>
                <option value="Pancreas">Pancreas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Recipient Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+ (Universal Recipient)</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O- (Universal Donor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Preferred City (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition gap-2 shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search Matches</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How the Matching Engine Works</h2>
          <p className="text-slate-600 mt-2 text-sm">
            We use a transparent rule-based algorithm modeled after medical compatibility guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Organ & Blood Type Filter</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Strict compatibility is checked first. For example, an <span className="font-semibold text-slate-800">O- donor</span> can donate red cells to all blood types, while <span className="font-semibold text-slate-800">AB+</span> can receive from all. Incompatible blood groups are safely eliminated.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Proximity & Transit Window</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Because organs have limited preservation time (ischemia time), donors located in the same city receive highest proximity points, followed by same-state matches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Urgency Prioritization</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Patients flagged as <span className="text-rose-600 font-semibold">Critical</span> or <span className="text-amber-600 font-semibold">High Priority</span> receive weighted priority scores to ensure urgent matches are surfaced immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
