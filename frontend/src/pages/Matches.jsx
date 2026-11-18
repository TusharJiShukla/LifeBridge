import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Search, CheckCircle2, MapPin, Phone, Mail, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const Matches = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialOrgan = searchParams.get('organ') || 'Kidney';
  const initialBlood = searchParams.get('bloodGroup') || 'A+';
  const initialCity = searchParams.get('city') || '';

  const [organ, setOrgan] = useState(initialOrgan);
  const [bloodGroup, setBloodGroup] = useState(initialBlood);
  const [city, setCity] = useState(initialCity);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const performSearch = async (targetOrgan, targetBlood, targetCity) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.quickCheck(targetOrgan, targetBlood, targetCity);
      setMatches(res.matches || []);
    } catch (err) {
      console.error('Match search failed:', err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(initialOrgan, initialBlood, initialCity);
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ organ, bloodGroup, city });
    performSearch(organ, bloodGroup, city);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Algorithm-Driven</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Live Match Directory</h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore registered donors medically compatible with recipient blood and organ requirements.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Patient City</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition shadow-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Matches</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-slate-600 font-medium">
          Found <span className="font-bold text-slate-900">{matches.length}</span> compatible match
          {matches.length === 1 ? '' : 'es'} for <span className="font-semibold text-rose-600">{organ}</span> ({bloodGroup})
        </p>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent mb-2"></div>
          <p className="text-sm">Evaluating biological compatibility matrix...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300 space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Biologically Compatible Donors Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Currently, there are no registered donors matching organ type <strong>{organ}</strong> with blood group compatibility for <strong>{bloodGroup}</strong>.
          </p>
          <div className="pt-2">
            <Link
              to="/register/donor"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
            >
              <Heart className="w-4 h-4" />
              <span>Register as a Donor for this Category</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(({ donor, score, reasons }) => {
            const scoreColor =
              score >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
              score >= 50 ? 'text-indigo-600 bg-indigo-50 border-indigo-200' :
              'text-amber-600 bg-amber-50 border-amber-200';

            const barColor =
              score >= 80 ? 'bg-emerald-500' :
              score >= 50 ? 'bg-indigo-500' :
              'bg-amber-500';

            return (
              <div
                key={donor._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{donor.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{donor.city}, {donor.state}</span>
                      </p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${scoreColor}`}>
                      {score}% Match
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${score}%` }}></div>
                  </div>

                  {/* Medical Details Badge */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Organ</span>
                      <span className="font-bold text-xs text-rose-600">{donor.organType}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Blood</span>
                      <span className="font-bold text-xs text-slate-800">{donor.bloodGroup}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Age / Sex</span>
                      <span className="font-bold text-xs text-slate-800">{donor.age} / {donor.gender[0]}</span>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Compatibility Factors:
                    </span>
                    {reasons.map((r, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Status: <span className="text-emerald-600 font-semibold">{donor.status}</span>
                  </span>
                  <button
                    onClick={() => setSelectedMatch(donor)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
                  >
                    View Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Donor Profile</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedMatch.name}</h3>
                <p className="text-xs text-slate-500">{selectedMatch.city}, {selectedMatch.state}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span><strong>Phone:</strong> {selectedMatch.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span><strong>Email:</strong> {selectedMatch.email}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80">
                <p className="text-slate-500"><strong>Medical Notes:</strong> {selectedMatch.medicalHistory || 'None reported'}</p>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Please coordinate with your hospital's transplant committee to schedule biological cross-matching.
              </span>
            </div>

            <button
              onClick={() => setSelectedMatch(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
