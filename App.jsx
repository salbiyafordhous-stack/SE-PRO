import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame, 
  HelpCircle,
  Users,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import Navbar from './components/Navbar';
import TicketCard from './components/TicketCard';
import TicketDetailModal from './components/TicketDetailModal';
import SubmitTicketModal from './components/SubmitTicketModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CommunityBoard from './components/CommunityBoard';
import KnowledgeBase from './components/KnowledgeBase';
import { INITIAL_TICKETS, ROLES, USERS, CATEGORIES, PRIORITIES, STATUSES } from './data/initialData';

export default function App() {
  // LocalStorage-backed state
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('eduresolve_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tickets:', e);
      }
    }
    return INITIAL_TICKETS;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('eduresolve_role') || ROLES.STUDENT;
  });

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'community' | 'analytics' | 'faq'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [ticketViewFilter, setTicketViewFilter] = useState('all'); // 'all' | 'my' | 'urgent' | 'pending' | 'resolved'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'priority' | 'upvotes'

  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Technician Dispatched',
      message: 'Network engineer assigned to Hostel Block C Wi-Fi outage (TKT-1082)',
      time: '10m ago',
      read: false,
      ticketId: 'TKT-1082'
    },
    {
      id: 'notif-2',
      title: 'Dean Review Alert',
      message: 'Urgent HVAC failure in Main Auditorium has been escalated (TKT-1090)',
      time: '1h ago',
      read: false,
      ticketId: 'TKT-1090'
    }
  ]);

  const currentUser = USERS[currentRole];

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('eduresolve_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('eduresolve_role', currentRole);
  }, [currentRole]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all tickets and state to initial demonstration dataset?')) {
      localStorage.removeItem('eduresolve_tickets');
      setTickets(INITIAL_TICKETS);
      showToast('System data reset to initial demo state!');
    }
  };

  // Upvote Handler
  const handleToggleUpvote = (ticketId) => {
    const userId = currentUser.id;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const upvotedList = t.upvotedBy || [];
        const hasUpvoted = upvotedList.includes(userId);
        const newUpvoted = hasUpvoted
          ? upvotedList.filter(id => id !== userId)
          : [...upvotedList, userId];
        const newCount = hasUpvoted ? Math.max(0, (t.upvotes || 1) - 1) : (t.upvotes || 0) + 1;

        if (!hasUpvoted) {
          showToast(`Upvoted ticket ${t.id}!`);
        }

        const updated = {
          ...t,
          upvotes: newCount,
          upvotedBy: newUpvoted,
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }

        return updated;
      }
      return t;
    }));
  };

  // Update Ticket (from detail modal)
  const handleUpdateTicket = (updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    showToast(`Ticket ${updatedTicket.id} updated successfully!`);
  };

  // Submit New Ticket
  const handleSubmitTicket = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Complaint filed with Tracking ID: ${newTicket.id}!`);
    setActiveTab('tickets');
    setSelectedTicket(newTicket);
  };

  // Notifications
  const handleNotificationClick = (notif) => {
    const target = tickets.find(t => t.id === notif.ticketId);
    if (target) {
      setSelectedTicket(target);
    }
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  // Filtered Tickets
  const filteredTickets = tickets
    .filter(t => {
      // Role & View Filter
      if (ticketViewFilter === 'my') {
        if (currentRole === 'student') {
          return t.author.id === currentUser.id || !t.author.isAnonymous;
        } else {
          return t.assignedTo.includes(currentUser.name) || t.department.includes(currentUser.department);
        }
      }
      if (ticketViewFilter === 'urgent') return t.priority === 'urgent' || t.priority === 'high' || t.status === 'escalated';
      if (ticketViewFilter === 'pending') return t.status === 'open' || t.status === 'in_progress' || t.status === 'in_review';
      if (ticketViewFilter === 'resolved') return t.status === 'resolved' || t.status === 'closed';
      return true;
    })
    .filter(t => {
      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      // Status filter
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      // Priority filter
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.location && t.location.toLowerCase().includes(q)) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === 'upvotes') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      // default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Summary counts for tabs
  const myTicketCount = tickets.filter(t => 
    currentRole === 'student' ? t.author.id === currentUser.id : t.assignedTo.includes(currentUser.name)
  ).length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' || t.status === 'escalated').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetData={handleResetData}
        tickets={tickets}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onClearNotifications={handleClearNotifications}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: TICKETS & GRIEVANCES LIST */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            
            {/* Persona Notice / Welcome Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900">
                      Welcome, {currentUser.name}
                    </h1>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                      {currentRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentRole === 'student' && `${currentUser.department} • ${currentUser.year} • ${currentUser.hostel}`}
                    {currentRole === 'staff' && `${currentUser.department} • Systems Support Team`}
                    {currentRole === 'admin' && `${currentUser.department} • University Helpdesk Governance`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>File Complaint</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setTicketViewFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    ticketViewFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  All Grievances ({tickets.length})
                </button>

                <button
                  onClick={() => setTicketViewFilter('my')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                    ticketViewFilter === 'my'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{currentRole === 'student' ? 'My Complaints' : 'Assigned to Me'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    ticketViewFilter === 'my' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {myTicketCount}
                  </span>
                </button>

                <button
                  onClick={() => setTicketViewFilter('urgent')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                    ticketViewFilter === 'urgent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Urgent & Escalated</span>
                  {urgentCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {urgentCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setTicketViewFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    ticketViewFilter === 'pending'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Pending Action
                </button>

                <button
                  onClick={() => setTicketViewFilter('resolved')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    ticketViewFilter === 'resolved'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Resolved & Closed
                </button>
              </div>

              {/* Sorting Control */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="priority">Highest Priority</option>
                  <option value="upvotes">Most Upvoted</option>
                </select>
              </div>
            </div>

            {/* Filter Toolbar: Search, Category, Status, Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, keyword, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>

              {/* Category */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium shadow-xs"
                >
                  <option value="all">All Departments ({CATEGORIES.length})</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium shadow-xs"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(STATUSES).map(([key, st]) => (
                    <option key={key} value={key}>{st.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium shadow-xs"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent (SLA: 6h)</option>
                  <option value="high">High (SLA: 24h)</option>
                  <option value="medium">Medium (SLA: 48h)</option>
                  <option value="low">Low (SLA: 72h)</option>
                </select>
              </div>
            </div>

            {/* Tickets Grid */}
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your filters or search keywords, or submit a new ticket for assistance.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSelectedPriority('all');
                    setTicketViewFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    currentRole={currentRole}
                    onSelectTicket={(t) => setSelectedTicket(t)}
                    onToggleUpvote={handleToggleUpvote}
                    isUpvoted={(ticket.upvotedBy || []).includes(currentUser.id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: COMMUNITY BOARD */}
        {activeTab === 'community' && (
          <CommunityBoard
            tickets={tickets}
            currentRole={currentRole}
            currentUserId={currentUser.id}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onToggleUpvote={handleToggleUpvote}
          />
        )}

        {/* TAB 3: ANALYTICS & SLA */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard tickets={tickets} />
        )}

        {/* TAB 4: KNOWLEDGE BASE / FAQs */}
        {activeTab === 'faq' && (
          <KnowledgeBase onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
        )}

      </main>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        currentRole={currentRole}
        onUpdateTicket={handleUpdateTicket}
        onToggleUpvote={handleToggleUpvote}
        isUpvoted={selectedTicket ? (selectedTicket.upvotedBy || []).includes(currentUser.id) : false}
      />

      {/* Submit Ticket Modal */}
      <SubmitTicketModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        currentRole={currentRole}
        onSubmitTicket={handleSubmitTicket}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 EduResolve • Online Student Complaint & Ticket Management Helpdesk System</p>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SLA Engine Live
            </span>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 transition"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
