import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Layers, 
  Building2, 
  Flame, 
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { CATEGORIES, STATUSES, PRIORITIES } from '../data/initialData';

export default function AnalyticsDashboard({ tickets }) {
  // Compute Key Metrics
  const total = tickets.length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress' || t.status === 'in_review').length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const escalatedCount = tickets.filter(t => t.status === 'escalated').length;

  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // SLA Breaches
  const now = new Date();
  const breachedTickets = tickets.filter(t => {
    if (t.status === 'resolved' || t.status === 'closed') return false;
    return new Date(t.slaDeadline) < now;
  });

  // Category counts
  const categoryCounts = CATEGORIES.map(cat => {
    const count = tickets.filter(t => t.category === cat.id).length;
    return {
      ...cat,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Author', 'AssignedTo', 'CreatedAt', 'Upvotes', 'Rating'];
    const rows = tickets.map(t => [
      `"${t.id}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.author?.isAnonymous ? 'Anonymous' : (t.author?.name || '').replace(/"/g, '""')}"`,
      `"${(t.assignedTo || '').replace(/"/g, '""')}"`,
      `"${t.createdAt}"`,
      `"${t.upvotes || 0}"`,
      `"${t.rating || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus-helpdesk-tickets-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Campus Helpdesk & SLA Performance Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance monitoring, ticket velocity, and department resolution benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Grievances</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{total}</h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> 100% indexed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Resolution Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{resolutionRate}%</h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
              <CheckCircle2 className="w-3 h-3" /> {resolvedCount} tickets cleared
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active In-Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Under Investigation</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{inProgressCount + openCount}</h3>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-0.5 mt-1">
              <Clock className="w-3 h-3" /> Average SLA: 4.8 hrs
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* SLA Breaches / Escalations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Escalated / Breached</p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{escalatedCount + breachedTickets.length}</h3>
            <span className="text-[11px] text-rose-600 font-medium flex items-center gap-0.5 mt-1">
              <AlertTriangle className="w-3 h-3" /> Requires Dean action
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Grievance Distribution by Department</h3>
            <span className="text-xs text-slate-400 font-medium">{CATEGORIES.length} Categories</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">{cat.count} tickets</span>
                    <span className="font-semibold text-slate-900 w-8 text-right">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="space-y-6">
          
          {/* Status Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Ticket Status Breakdown</h3>
            <div className="space-y-2.5 pt-1">
              {Object.entries(STATUSES).map(([key, item]) => {
                const count = tickets.filter(t => t.status === key).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${item.color}`}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-600 font-bold">{count}</span>
                      <span className="text-slate-400 text-[10px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Resolution SLA Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Campus SLA Benchmark</span>
            </div>
            <h4 className="text-base font-bold">University Charter Target</h4>
            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
              95% of student tickets resolved within guaranteed SLA window. Current university semester compliance: <strong className="text-emerald-400">92.4%</strong>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
