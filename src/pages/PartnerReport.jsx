import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import partners from '../data/partners.mock.json';
import reports from '../data/partnerReports.mock';
import { getPartnerHealthTier, healthTierMessage } from '../engine/partnerHealthEngine';
import ExplainabilityPanel from '../components/ExplainabilityPanel';
import Card from '../components/ui/Card';

const unavailable = 'Not enough data yet';
const PartnerReport = () => {
  const { partnerId } = useParams(); const partner = partners.find((item) => item.id === partnerId); const report = reports[partnerId];
  if (!partner) return <div className="py-12 text-center">Partner not found. <Link className="text-primary-700 underline" to="/partner-locator">Return to locator</Link></div>;
  const health = getPartnerHealthTier(partner.healthSignal); const summary = report?.avgTurnaroundDays ? `This partner typically processes applications in about ${report.avgTurnaroundDays} days.${report.successRatePercent ? ` Its reported successful completion rate is ${report.successRatePercent}%.` : ''}` : "We don't yet have enough performance data for this partner.";
  const metrics = [{ label: 'Typical turnaround', value: report?.avgTurnaroundDays ? `About ${report.avgTurnaroundDays} days` : unavailable }, { label: 'Successful completion rate', value: report?.successRatePercent ? `${report.successRatePercent}%` : unavailable }, { label: 'Applicant feedback', value: report?.ratingCount ? `${report.applicantRating}/5 from ${report.ratingCount} reviews` : 'No applicant feedback yet' }, { label: 'Capacity status', value: health.label }];
  return <div className="mx-auto max-w-4xl space-y-6 py-4"><Link className="text-sm font-semibold text-primary-700 underline dark:text-primary-300" to="/partner-locator">← Back to partner locator</Link><div><p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Partner health & trust report</p><h1 className="mt-1 text-3xl font-bold dark:text-white">{partner.name}</h1><p className="mt-2 text-slate-600 dark:text-slate-300">{partner.type} · {partner.address}</p></div><div className="grid gap-4 sm:grid-cols-2">{metrics.map((metric) => <Card className="p-5" key={metric.label}><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-2 text-lg font-bold dark:text-white">{metric.label === 'Applicant feedback' && report?.ratingCount ? <><Star className="mr-1 inline h-5 w-5 fill-amber-400 text-amber-500" aria-hidden="true" /><span aria-label={`${report.applicantRating} out of 5 from ${report.ratingCount} reviews`}>{metric.value}</span></> : metric.value}</p></Card>)}</div><ExplainabilityPanel verdict={health.tier === 'recommended' ? 'eligible' : health.tier === 'unknown' ? 'lower-rank' : 'not-eligible'} reasonText={summary} suggestion={healthTierMessage(partner.healthSignal, health.tier)} /></div>;
};
export default PartnerReport;
