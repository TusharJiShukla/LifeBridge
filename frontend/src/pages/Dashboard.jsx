import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Heart, Activity, User, MapPin, Phone, Mail, CheckCircle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(user?.status || '');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setCurrentStatus(user.status);

    const fetchMatches = async () => {
      setLoading(true);
      try {
        if (user.role === 'recipient') {
          const res = await api.getMatchesForRecipient(user._id);
          setMatches(res.matches || []);
        } else {
          const res = await api.getMatchesForDonor(user._id);
          setMatches(res.matches || []);
        }
      } catch (err) {
        console.error('Failed to load personalized dashboard matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, isAuthenticated, navigate]);

  const handleStatusChange = async (newStatus) => {
    if (!user) return;
    setStatusUpdating(true);
    try {
      if (user.role === 'donor') {
        await api.updateDonorStatus(user._id, newStatus);
      } else {
        await api.updateRecipientStatus(user._id, newStatus);
      }
      setCurrentStatus(newStatus);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!user) return null;

  const isDonor = user.role === 'donor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${isDonor ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {isDonor ? <Heart className="w-8 h-8 fill-rose-500" /> : <Activity className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isDonor ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {isDonor ? 'Donor Profile' : 'Recipient Request'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-2 mt-1">
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.phone}</span>
                <span>•</span>
                <span>{user.city}</span>
              </p>
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">Status:</span>
            <select
              value={currentStatus}
              disabled={statusUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              {isDonor ? (
                <>
                  <option value="Available">Available (Active Pledge)</option>
                  <option value="Pledged">Pledged (Matched with Recipient)</option>
                  <option value="Completed">Completed Donation</option>
                </>
              ) : (
                <>
                  <option value="Waiting">Waiting for Match</option>
                  <option value="Matched">Match Found</option>
                  <option value="Closed">Request Closed</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Profile Detail Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Organ</span>
            <span className="text-sm font-bold text-rose-600">{isDonor ? user.organType : user.organNeeded}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Blood Group</span>
            <span className="text-sm font-bold text-slate-900">{user.bloodGroup}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Age / Gender</span>
            <span className="text-sm font-bold text-slate-900">{user.age} yrs • {user.gender}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">
              {isDonor ? 'Health Notes' : 'Urgency Level'}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {isDonor ? (user.medicalHistory || 'Clean') : user.urgencyLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Personalized Matches Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Compatibility Matches</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isDonor
                ? 'Waiting Patients Compatible With Your Organ Pledge'
                : 'Pledged Donors Compatible With Your Requirement'}
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {matches.length} Compatible {matches.length === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent mb-2"></div>
            <p className="text-sm">Calculating real-time biological compatibility...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Active Matches Found Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Our matching algorithm runs continuously. As soon as a compatible {isDonor ? 'patient' : 'donor'} registers, they will appear right here ranked by compatibility score!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((item, index) => {
              const profile = isDonor ? item.recipient : item.donor;
              const { score, reasons } = item;

              const scoreColor =
                score >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                score >= 50 ? 'text-indigo-600 bg-indigo-50 border-indigo-200' :
                'text-amber-600 bg-amber-50 border-amber-200';

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{profile.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{profile.city} {profile.hospitalName ? `(${profile.hospitalName})` : ''}</span>
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${scoreColor}`}>
                        {score}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Blood Group</span>
                        <span className="font-bold text-slate-900">{profile.bloodGroup}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                          {isDonor ? 'Urgency' : 'Organ'}
                        </span>
                        <span className="font-bold text-rose-600">
                          {isDonor ? (profile.urgencyLevel || 'Normal') : profile.organType}
                        </span>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Algorithm Factor Breakdown:
                      </span>
                      {reasons.map((r, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Contact:</span>
                    <span className="font-semibold text-slate-800">{profile.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
