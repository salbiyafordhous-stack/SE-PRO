import React from 'react';
import { 
  Clock, 
  MapPin, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  User,
  Shield,
  Wifi,
  Home,
  GraduationCap,
  FileText,
  CreditCard,
  BookOpen,
  Utensils,
  ShieldAlert,
  HelpCircle,
  Flame
} from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUSES } from '../data/initialData';

const iconMap = {
  Wifi,
  Home,
  GraduationCap,
  FileText,
  CreditCard,
  BookOpen,
  Utensils,
  ShieldAlert,
  HelpCircle
};

export default function TicketCard({ ticket, currentRole, onSelectTicket, onToggleUpvote, isUpvoted }) {
  const categoryObj = CATEGORIES.find(c => c.id === ticket.category) || CATEGORIES[CATEGORIES.length - 1];
  const CategoryIcon = iconMap[categoryObj.icon] || HelpCircle;
  const priorityInfo = PRIORITIES[ticket.priority] || PRIORITIES.medium;
  const statusInfo = STATUSES[ticket.status] || STATUSES.open;

  // SLA Calculation
  const deadlineDate = new Date(ticket.slaDeadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
  const isSlaBreached = diffHours < 0 && ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <div 
      onClick={() => onSelectTicket(ticket)}
      className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer relative flex flex-col justify-between"
    >
      {/* Top Header: ID, Category & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {ticket.id}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${priorityInfo.color} flex items-center gap-1`}>
              {ticket.priority === 'urgent' && <Flame className="w-3 h-3 animate-bounce" />}
              {priorityInfo.label} Priority
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center text-xs text-slate-500 font-medium">
            <CategoryIcon className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
            <span className="hidden sm:inline">{categoryObj.name}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {ticket.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {ticket.description}
        </p>

        {/* Metadata: Location & Author */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
          {ticket.location && (
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[200px]">{ticket.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {ticket.author.isAnonymous ? (
              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-medium border border-purple-200">
                <Shield className="w-3 h-3 text-purple-600" />
                Anonymous Student
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {ticket.author.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bar: SLA & Interactions */}
      <div className="flex items-center justify-between pt-1 text-xs">
        {/* SLA Status indicator */}
        <div>
          {ticket.status === 'resolved' || ticket.status === 'closed' ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolved on time
            </span>
          ) : isSlaBreached ? (
            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              SLA Breached ({Math.abs(diffHours)}h overdue)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              SLA: {diffHours}h remaining
            </span>
          )}
        </div>

        {/* Right side: Upvote and Comments count */}
        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onToggleUpvote(ticket.id)}
            title="Upvote if you are also experiencing this issue"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
              isUpvoted
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>{ticket.upvotes || 0}</span>
          </button>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{ticket.messages ? ticket.messages.length : 0}</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </div>
  );
}
