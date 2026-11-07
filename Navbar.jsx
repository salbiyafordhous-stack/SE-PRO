import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  PlusCircle, 
  BarChart3, 
  Layers, 
  HelpCircle, 
  Users, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ROLES, USERS } from '../data/initialData';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  onOpenSubmitModal,
  searchQuery,
  setSearchQuery,
  onResetData,
  tickets,
  notifications,
  onNotificationClick,
  onClearNotifications
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currentUser = USERS[currentRole];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('tickets')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EduResolve</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Campus</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Student Helpdesk & Grievance Portal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tickets'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tickets & Grievances</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Campus Board</span>
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] rounded-full font-semibold">
                Upvote
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>SLA & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'faq'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Knowledge Base</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Submit Ticket Button */}
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Complaint</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="font-semibold text-xs text-slate-800">Campus Alerts & Updates</span>
                    <button
                      onClick={onClearNotifications}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No new notifications right now
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onNotificationClick(notif);
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                            !notif.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-800">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition"
                title="Switch Role"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Role</span>
                  <span className="text-xs font-semibold text-slate-800 capitalize leading-tight">
                    {currentRole}
                  </span>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-white shadow-sm"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                    <p className="text-xs text-slate-500">Test different user perspectives</p>
                  </div>

                  {/* Student */}
                  <button
                    onClick={() => {
                      setCurrentRole(ROLES.STUDENT);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                      currentRole === ROLES.STUDENT ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img src={USERS.student.avatar} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{USERS.student.name}</p>
                      <p className="text-[10px] text-slate-500">Student • CS 3rd Year</p>
                    </div>
                  </button>

                  {/* Staff */}
                  <button
                    onClick={() => {
                      setCurrentRole(ROLES.STAFF);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                      currentRole === ROLES.STAFF ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img src={USERS.staff.avatar} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{USERS.staff.name}</p>
                      <p className="text-[10px] text-slate-500">Support Staff • IT & Networks</p>
                    </div>
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => {
                      setCurrentRole(ROLES.ADMIN);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                      currentRole === ROLES.ADMIN ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img src={USERS.admin.avatar} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{USERS.admin.name}</p>
                      <p className="text-[10px] text-slate-500">Dean & Admin • Student Welfare</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset all demo data to initial state"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-2 py-1 rounded-md font-medium ${activeTab === 'tickets' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
          >
            Tickets
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-2 py-1 rounded-md font-medium ${activeTab === 'community' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2 py-1 rounded-md font-medium ${activeTab === 'analytics' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-2 py-1 rounded-md font-medium ${activeTab === 'faq' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
          >
            FAQs
          </button>
        </div>

      </div>
    </header>
  );
}
