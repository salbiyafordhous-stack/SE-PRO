import React, { useState } from 'react';
import { 
  Users, 
  ThumbsUp, 
  Flame, 
  Sparkles, 
  Clock, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { CATEGORIES, STATUSES, PRIORITIES } from '../data/initialData';

export default function CommunityBoard({ 
  tickets, 
  currentRole, 
  onSelectTicket, 
  onToggleUpvote, 
  currentUserId 
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'resolved'
  const [searchTerm, setSearchTerm] = useState('');

  // Community tickets
  const communityTickets = tickets.filter(t => t.isCommunityIssue !== false);

  const filteredTickets = communityTickets
    .filter(t => {
      if (filter === 'open') return t.status !== 'resolved' && t.status !== 'closed';
      if (filter === 'resolved') return t.status === 'resolved' || t.status === 'closed';
      return true;
    })
    .filter(t => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        (t.location && t.location.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)); // Most upvoted first

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pointer-events-none">
          <Users className="w-96 h-96 -mr-16" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Consensus Board</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Common Campus Issues & Upvotes
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Experiencing the same problem? Upvote existing complaints to amplify campus visibility and help administration prioritize fixes instead of filing duplicate tickets.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> Top voted issues get direct Dean review
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Public resolution tracking
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search campus community issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium w-full sm:w-auto justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({communityTickets.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'open' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active / In Progress
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'resolved' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Community Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No community issues found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isUpvoted = (t.upvotedBy || []).includes(currentUserId);
            const statusInfo = STATUSES[t.status] || STATUSES.open;
            const priorityInfo = PRIORITIES[t.priority] || PRIORITIES.medium;
            const categoryObj = CATEGORIES.find(c => c.id === t.category) || CATEGORIES[0];

            return (
              <div
                key={t.id}
                onClick={() => onSelectTicket(t)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                
                {/* Left side: Upvote Button Column */}
                <div 
                  className="sm:w-20 flex sm:flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-blue-50/50 group-hover:border-blue-200 transition shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleUpvote(t.id);
                  }}
                >
                  <button
                    className={`p-1.5 rounded-lg transition ${
                      isUpvoted ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isUpvoted ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </button>
                  <span className={`text-sm font-extrabold font-mono ml-2 sm:ml-0 ${
                    isUpvoted ? 'text-blue-600' : 'text-slate-700'
                  }`}>
                    {t.upvotes || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold hidden sm:block">
                    votes
                  </span>
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {t.id}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {categoryObj.name}
                    </span>
                    {t.upvotes >= 10 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        <Flame className="w-3 h-3 text-amber-600" /> High Campus Impact
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                    {t.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    {t.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {t.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {(t.messages || []).length} responses
                    </span>
                  </div>
                </div>

                {/* Right side: View Details */}
                <div className="self-end sm:self-center shrink-0">
                  <button className="px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition">
                    View Discussion →
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
