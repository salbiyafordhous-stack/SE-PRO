import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  User, 
  Lock, 
  ThumbsUp, 
  Star, 
  Building2, 
  Calendar, 
  MessageSquare, 
  History, 
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, PRIORITIES, STATUSES, USERS } from '../data/initialData';

export default function TicketDetailModal({ 
  ticket, 
  isOpen, 
  onClose, 
  currentRole, 
  onUpdateTicket,
  onToggleUpvote,
  isUpvoted
}) {
  if (!isOpen || !ticket) return null;

  const [activeTab, setActiveTab] = useState('discussion'); // 'discussion' | 'timeline' | 'internal'
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [rating, setRating] = useState(ticket.rating || 5);
  const [ratingComment, setRatingComment] = useState(ticket.ratingFeedback || '');
  const [showRatingModal, setShowRatingModal] = useState(false);

  const currentUser = USERS[currentRole];
  const isStaffOrAdmin = currentRole === 'staff' || currentRole === 'admin';
  const isStudentAuthor = ticket.author.id === currentUser.id || !ticket.author.isAnonymous;

  const priorityInfo = PRIORITIES[ticket.priority] || PRIORITIES.medium;
  const statusInfo = STATUSES[ticket.status] || STATUSES.open;
  const categoryObj = CATEGORIES.find(c => c.id === ticket.category) || CATEGORIES[0];

  // SLA Calculation
  const deadlineDate = new Date(ticket.slaDeadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
  const isSlaBreached = diffHours < 0 && ticket.status !== 'resolved' && ticket.status !== 'closed';

  // Progression steps
  const steps = [
    { key: 'open', label: 'Submitted' },
    { key: 'in_review', label: 'In Review' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'open': return 0;
      case 'in_review': return 1;
      case 'in_progress': return 2;
      case 'resolved': return 3;
      case 'closed': return 4;
      case 'escalated': return 2;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(ticket.status);

  // Send student/public message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      senderRole: currentRole,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
      isInternal: false,
    };

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'message',
      text: `${currentUser.name} (${currentRole.toUpperCase()}) added a response`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...ticket,
      messages: [...(ticket.messages || []), newMessage],
      timeline: [...(ticket.timeline || []), newTimelineEvent],
    };

    onUpdateTicket(updated);
    setReplyText('');
  };

  // Add internal staff note
  const handleAddInternalNote = (e) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      sender: currentUser.name,
      senderRole: currentRole,
      text: internalNoteText.trim(),
      timestamp: new Date().toISOString(),
      isInternal: true,
    };

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'internal_note',
      text: `Internal note logged by ${currentUser.name}`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...ticket,
      messages: [...(ticket.messages || []), newNote],
      timeline: [...(ticket.timeline || []), newTimelineEvent],
    };

    onUpdateTicket(updated);
    setInternalNoteText('');
  };

  // Status Change
  const handleStatusChange = (newStatus) => {
    if (newStatus === ticket.status) return;

    if (newStatus === 'resolved') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'status_change',
      text: `Status updated from ${ticket.status.toUpperCase()} to ${newStatus.toUpperCase()} by ${currentUser.name}`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...ticket,
      status: newStatus,
      timeline: [...(ticket.timeline || []), newTimelineEvent],
    };

    onUpdateTicket(updated);
  };

  // Reassignment
  const handleReassign = (officerName, deptName) => {
    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'reassignment',
      text: `Reassigned to ${officerName} (${deptName}) by ${currentUser.name}`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...ticket,
      assignedTo: officerName,
      department: deptName,
      timeline: [...(ticket.timeline || []), newTimelineEvent],
    };

    onUpdateTicket(updated);
  };

  // Escalate to Dean
  const handleEscalateToDean = () => {
    const reason = prompt('Please specify why this complaint is being escalated to the Dean:');
    if (!reason) return;

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'escalation',
      text: `ESCALATED TO DEAN by ${currentUser.name}. Reason: ${reason}`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const deanAlertMsg = {
      id: `msg-${Date.now()}`,
      sender: 'System SLA & Grievance Alert',
      senderRole: 'admin',
      text: `[URGENT ESCALATION TO DEAN] Escalated by ${currentUser.name}. Note: "${reason}"`,
      timestamp: new Date().toISOString(),
      isInternal: false,
    };

    const updated = {
      ...ticket,
      status: 'escalated',
      priority: 'urgent',
      assignedTo: 'Dr. Eleanor Vance (Dean)',
      department: 'Office of Student Affairs',
      timeline: [...(ticket.timeline || []), newTimelineEvent],
      messages: [...(ticket.messages || []), deanAlertMsg],
    };

    onUpdateTicket(updated);
    alert('This grievance has been directly escalated to Dean Dr. Eleanor Vance with High Priority status.');
  };

  // Submit Feedback Rating
  const handleSaveRating = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'rating',
      text: `Student left a ${rating}-star satisfaction rating: "${ratingComment || 'Resolved effectively'}"`,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...ticket,
      status: 'closed',
      rating,
      ratingFeedback: ratingComment,
      timeline: [...(ticket.timeline || []), newTimelineEvent],
    };

    onUpdateTicket(updated);
    setShowRatingModal(false);
  };

  const visibleMessages = (ticket.messages || []).filter(m => !m.isInternal || isStaffOrAdmin);
  const internalNotes = (ticket.messages || []).filter(m => m.isInternal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-xs">
                  {ticket.id}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priorityInfo.color}`}>
                  {priorityInfo.label} Priority
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  {categoryObj.name}
                </span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {ticket.title}
              </h2>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {ticket.author.isAnonymous ? 'Confidential Student' : ticket.author.name}
                </span>
                {ticket.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleUpvote(ticket.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  isUpvoted 
                    ? 'bg-blue-50 text-blue-700 border-blue-300' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Upvote campus issue"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{ticket.upvotes || 0}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SLA Tracker Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">Assigned:</span>
              <span className="text-slate-900 font-semibold">{ticket.assignedTo}</span>
              <span className="text-slate-400">({ticket.department})</span>
            </div>

            <div>
              {ticket.status === 'resolved' || ticket.status === 'closed' ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Resolved & Completed
                </span>
              ) : isSlaBreached ? (
                <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-semibold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  SLA Target Breached by {Math.abs(diffHours)} Hours
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  SLA Target: {diffHours} Hours Remaining
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progression */}
          {ticket.status !== 'escalated' ? (
            <div className="mt-4 hidden sm:flex items-center justify-between relative px-2">
              <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-200 -z-0" />
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={st.key} className="flex flex-col items-center relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100'
                        : isPassed
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-400 border-slate-300'
                    }`}>
                      {isPassed && idx < currentStepIdx ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium ${
                      isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="font-bold">ESCALATED TICKET:</span>
                <span>Flagged for immediate executive intervention by Dean Office.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body & Tabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Main Description */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Complaint Description</h4>
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Rating Display if already rated */}
          {ticket.rating && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= ticket.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-emerald-800 ml-2">
                    Student Rating: {ticket.rating}/5 Stars
                  </span>
                </div>
                {ticket.ratingFeedback && (
                  <p className="text-xs text-emerald-700 italic">"{ticket.ratingFeedback}"</p>
                )}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
                Verified Feedback
              </span>
            </div>
          )}

          {/* Control Bar for Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs">
            {/* Staff / Admin Controls */}
            {isStaffOrAdmin ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-700">Update Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in_review">In Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="escalated">Escalated</option>
                </select>

                <button
                  onClick={() => {
                    const officer = prompt('Assign new officer name:', ticket.assignedTo);
                    if (officer) handleReassign(officer, ticket.department);
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition"
                >
                  Reassign Officer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <button
                    onClick={handleEscalateToDean}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Escalate to Dean
                  </button>
                )}

                {ticket.status === 'resolved' && !ticket.rating && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold shadow-sm transition"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Confirm Resolution & Rate
                  </button>
                )}
              </div>
            )}

            {/* Tab Switcher */}
            <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                  activeTab === 'discussion' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Responses ({visibleMessages.length})
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                  activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit Log ({(ticket.timeline || []).length})
              </button>
              {isStaffOrAdmin && (
                <button
                  onClick={() => setActiveTab('internal')}
                  className={`px-3 py-1 rounded-md font-medium text-xs transition flex items-center gap-1 ${
                    activeTab === 'internal' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Staff Notes ({internalNotes.length})
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: Discussion Thread */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              {visibleMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No replies yet. Use the message box below to post an update.
                </div>
              ) : (
                visibleMessages.map((msg) => {
                  const isCurrentAuthor = msg.sender === currentUser.name;
                  const isStaff = msg.senderRole === 'staff' || msg.senderRole === 'admin';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCurrentAuthor ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700">{msg.sender}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          isStaff ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {msg.senderRole}
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        isCurrentAuthor
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : isStaff
                          ? 'bg-blue-50 text-slate-900 border border-blue-200 rounded-tl-xs'
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply as ${currentUser.name} (${currentRole})...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Audit Timeline Log */}
          {activeTab === 'timeline' && (
            <div className="space-y-3 py-2">
              {(ticket.timeline || []).map((evt, idx) => (
                <div key={evt.id || idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 ring-4 ring-blue-100" />
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{evt.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(evt.timestamp).toLocaleString()} • Logged by {evt.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Internal Notes (Staff/Admin Only) */}
          {activeTab === 'internal' && isStaffOrAdmin && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Confidential Internal Log: Visible only to Helpdesk Staff & Administration. Hidden from students.</span>
              </div>

              {internalNotes.map((note) => (
                <div key={note.id} className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs">
                  <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold mb-1">
                    <span>{note.sender}</span>
                    <span className="text-slate-400 font-normal">{new Date(note.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 whitespace-pre-wrap">{note.text}</p>
                </div>
              ))}

              <form onSubmit={handleAddInternalNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add private investigation note or technician updates..."
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  className="flex-1 bg-amber-50/40 border border-amber-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!internalNoteText.trim()}
                  className="px-4 py-2.5 bg-amber-600 disabled:opacity-50 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  Save Note
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Student Satisfaction Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Rate Your Resolution Experience</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Help us maintain university service standards by rating the support provided for {ticket.id}.
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Any comments or feedback for the support officer? (Optional)"
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRating}
                className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
