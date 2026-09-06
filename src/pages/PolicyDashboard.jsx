import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, ShieldCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import schemes from '../data/schemes.config.json';
import reports from '../data/partnerReports.mock';
import Card from '../components/ui/Card';

const stageOrder = ['pending-signature', 'submitted', 'partner-review', 'verification', 'sanctioned', 'disbursed'];
const colors = ['#0f766e', '#0d9488', '#14b8a6', '#f59e0b', '#d97706', '#7c3aed'];
const label = (value) => value.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const PolicyDashboard = () => {
  const applications = useAppStore((state) => state.applications);
  const partners = useAppStore((state) => state.partners);
  const [sort, setSort] = useState('successRatePercent');

  const demandData = useMemo(() => {
    const rows = new Map();
    applications.forEach((application) => {
      const first = application.stageHistory[0]?.changedAt || application.createdAt;
      const month = new Date(first).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      const scheme = schemes.find((item) => item.id === application.schemeId)?.name || 'Scheme unavailable';
      const key = `${month}-${scheme}`;
      const current = rows.get(key) || { month, scheme, demand: 0, disbursed: 0 };
      current.demand += 1;
      if (application.stage === 'disbursed') current.disbursed += 1;
      rows.set(key, current);
    });
    return [...rows.values()];
  }, [applications]);

  const funnelData = useMemo(() => stageOrder.map((stage) => ({ stage: label(stage), count: applications.filter((item) => stageOrder.indexOf(item.stage) >= stageOrder.indexOf(stage)).length })), [applications]);
  const leaderboard = useMemo(() => partners.map((partner) => ({ ...partner, ...(reports[partner.id] || {}) })).sort((a, b) => (b[sort] || -1) - (a[sort] || -1)), [partners, sort]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div>
        <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">NSFDC policy view</p>
        <h1 className="mt-1 text-3xl font-bold dark:text-white">Policy Analytics Dashboard</h1>
      </div>
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-primary-950 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100">
        <div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0" /><p className="text-sm font-semibold">All figures are aggregated and anonymized. No individual applicant is identifiable from this view.</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary-600" /><h2 className="font-bold dark:text-white">Demand vs disbursement</h2></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line dataKey="demand" stroke="#0f766e" strokeWidth={3} />
                <Line dataKey="disbursed" stroke="#d97706" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-bold dark:text-white">Drop-off funnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="stage" width={120} />
                <Tooltip />
                <Bar dataKey="count">{funnelData.map((entry, index) => <Cell key={entry.stage} fill={colors[index % colors.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center dark:border-slate-700">
          <div><h2 className="font-bold dark:text-white">Partner performance leaderboard</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Based on data collected through VittSetu, not an official NSFDC audit.</p></div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="successRatePercent">Sort by success rate</option>
            <option value="avgTurnaroundDays">Sort by turnaround</option>
            <option value="applicantRating">Sort by rating</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300"><tr><th className="px-5 py-3">Partner</th><th className="px-5 py-3">District</th><th className="px-5 py-3">Capacity</th><th className="px-5 py-3">Avg turnaround</th><th className="px-5 py-3">Success rate</th><th className="px-5 py-3">Rating</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((partner) => <tr key={partner.id}><td className="px-5 py-4 font-bold dark:text-white">{partner.name}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{partner.district}</td><td className="px-5 py-4 capitalize">{partner.healthSignal?.capacityStatus || 'data not available yet'}</td><td className="px-5 py-4">{partner.avgTurnaroundDays ? `${partner.avgTurnaroundDays} days` : 'data not available yet'}</td><td className="px-5 py-4">{partner.successRatePercent ? `${partner.successRatePercent}%` : 'data not available yet'}</td><td className="px-5 py-4">{partner.ratingCount ? `${partner.applicantRating}/5` : 'data not available yet'}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PolicyDashboard;
