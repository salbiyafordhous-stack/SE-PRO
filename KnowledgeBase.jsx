import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  PlusCircle, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { FAQS, CATEGORIES } from '../data/initialData';

export default function KnowledgeBase({ onOpenSubmitModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(FAQS[0]?.id || null);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  const filteredFaqs = FAQS.filter(faq => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
  });

  const toggleExpand = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const markHelpful = (id, isHelpful) => {
    setHelpfulFeedback({
      ...helpfulFeedback,
      [id]: isHelpful,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Self-Service Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Knowledge Base & Instant Answers
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Find immediate answers to common questions about Wi-Fi access, hostel regulations, examination re-evaluation, scholarship fee holds, and student welfare policies.
          </p>

          {/* Search Bar inside Hero */}
          <div className="mt-5 relative">
            <input
              type="text"
              placeholder="Search by keywords (e.g., wifi password, grade review, hostel fee)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-white text-slate-900 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Topics ({FAQS.length})
        </button>

        {CATEGORIES.map(cat => {
          const count = FAQS.filter(f => f.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No matching articles found</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Can't find the answer you are looking for? Our campus support team is ready to help.
            </p>
            <button
              onClick={onOpenSubmitModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              Submit a Ticket
            </button>
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedFaqId === faq.id;
            const categoryObj = CATEGORIES.find(c => c.id === faq.category) || CATEGORIES[0];
            const feedback = helpfulFeedback[faq.id];

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {categoryObj.name}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="text-slate-400 p-1 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-700 border-t border-slate-100 bg-slate-50/40">
                    <p className="leading-relaxed whitespace-pre-wrap">{faq.answer}</p>

                    {/* Helpful query feedback */}
                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Was this article helpful?</span>

                      {feedback === undefined ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markHelpful(faq.id, true)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition text-[11px] font-semibold"
                          >
                            <ThumbsUp className="w-3 h-3" /> Yes
                          </button>
                          <button
                            onClick={() => markHelpful(faq.id, false)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition text-[11px] font-semibold"
                          >
                            <ThumbsDown className="w-3 h-3" /> No
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Thank you for your feedback!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Need Help Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Still have an unresolved campus issue?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            File an official grievance ticket with guaranteed SLA countdown and officer assignment.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open a Support Ticket</span>
        </button>
      </div>

    </div>
  );
}
