import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Upload, 
  ShieldCheck, 
  Paperclip, 
  Clock, 
  MapPin, 
  Sparkles, 
  Lightbulb, 
  HelpCircle,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, PRIORITIES, FAQS, USERS } from '../data/initialData';

export default function SubmitTicketModal({ 
  isOpen, 
  onClose, 
  currentRole, 
  onSubmitTicket 
}) {
  if (!isOpen) return null;

  const currentUser = USERS[currentRole];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState(currentUser.hostel || 'Hostel Block C - Room 304');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCommunityIssue, setIsCommunityIssue] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [suggestedFaq, setSuggestedFaq] = useState(null);

  // Live FAQ detection based on keywords
  const handleTitleChange = (val) => {
    setTitle(val);
    const lower = val.toLowerCase();
    if (lower.length > 3) {
      const match = FAQS.find(f => 
        lower.includes('wifi') || lower.includes('internet') ? f.category === 'it_network' :
        lower.includes('grade') || lower.includes('exam') || lower.includes('mark') ? f.category === 'examinations' :
        lower.includes('room') || lower.includes('hostel') || lower.includes('water') ? f.category === 'hostel_housing' :
        lower.includes('fee') || lower.includes('scholarship') ? f.category === 'finance_fees' :
        lower.includes('harass') || lower.includes('ragging') ? f.category === 'safety_harassment' :
        false
      );
      setSuggestedFaq(match || null);
    } else {
      setSuggestedFaq(null);
    }
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments([...attachments, { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }]);
    }
  };

  const removeAttachment = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please enter both title and description for your ticket.');
      return;
    }

    const selectedCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
    const priorityObj = PRIORITIES[priority] || PRIORITIES.medium;
    const slaDeadline = new Date(Date.now() + 1000 * 60 * 60 * priorityObj.slaHours).toISOString();
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: newId,
      title: title.trim(),
      category,
      priority,
      status: 'open',
      author: {
        id: currentUser.id,
        name: isAnonymous ? 'Anonymous Student' : currentUser.name,
        email: isAnonymous ? 'confidential@campus.edu' : currentUser.email,
        isAnonymous,
      },
      location: location.trim(),
      description: description.trim(),
      assignedTo: selectedCategory.defaultOfficer,
      department: selectedCategory.name,
      createdAt: new Date().toISOString(),
      slaDeadline,
      upvotes: 1,
      upvotedBy: [currentUser.id],
      isCommunityIssue,
      attachments,
      timeline: [
        {
          id: `evt-${Date.now()}`,
          type: 'creation',
          text: `Ticket filed by ${isAnonymous ? 'Anonymous Student' : currentUser.name} (${priority.toUpperCase()} Priority)`,
          author: isAnonymous ? 'Confidential' : currentUser.name,
          timestamp: new Date().toISOString(),
        },
        {
          id: `evt-${Date.now() + 1}`,
          type: 'assignment',
          text: `Auto-assigned to ${selectedCategory.defaultOfficer} under ${selectedCategory.name}`,
          author: 'Campus Routing Engine',
          timestamp: new Date().toISOString(),
        }
      ],
      messages: [],
      rating: null,
      ratingFeedback: '',
    };

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 }
    });

    onSubmitTicket(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Submit Student Grievance / Ticket</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Your grievance will be logged with a unique tracking ID and SLA resolution timer.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {/* Live Suggested FAQ Deflection Banner */}
          {suggestedFaq && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-amber-900">Instant Answer Found: </span>
                  <span className="text-amber-800 font-medium">{suggestedFaq.question}</span>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-white/70 p-2 rounded-lg border border-amber-100">
                    {suggestedFaq.answer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Complaint / Ticket Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hostel Block C 3rd Floor Wi-Fi drops frequently"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Priority Level & SLA Guarantee
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="low">Low (Expected SLA: 72 Hours)</option>
                <option value="medium">Medium (Expected SLA: 48 Hours)</option>
                <option value="high">High (Expected SLA: 24 Hours)</option>
                <option value="urgent">Urgent / Emergency (SLA: 6 Hours)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Exact Campus Location / Room No.
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Hostel Block C - Room 304, or Science Block Lab 4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide specific details about the issue, when it started, and steps already attempted..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Attachments Simulator */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Attach Proof / Screenshots / Documents (Optional)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:bg-slate-100/70 text-center transition cursor-pointer relative">
              <input
                type="file"
                onChange={handleSimulateUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <p className="text-slate-600 font-medium">Click or drag files here to attach</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, PDF up to 10MB</p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-[11px]">
                    <Paperclip className="w-3 h-3" />
                    <span>{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="ml-1 text-slate-400 hover:text-rose-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options: Anonymous & Community Upvoting */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Submit Anonymously (Anti-Retaliation Protection)
                </span>
                <p className="text-[11px] text-slate-500">
                  Your identity and student ID will be concealed from all department staff and reviewers.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={isCommunityIssue}
                onChange={(e) => setIsCommunityIssue(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800">
                  Publish to Campus Community Board
                </span>
                <p className="text-[11px] text-slate-500">
                  Allow other affected students to upvote this issue so university administration can gauge overall impact.
                </p>
              </div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Grievance</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
