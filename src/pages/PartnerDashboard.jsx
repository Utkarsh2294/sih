import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, ChevronRight, Gauge } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import schemes from '../data/schemes.config.json';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import VerifiedPartnerBadge from '../components/VerifiedPartnerBadge';
import { toast } from '../hooks/useToast';

const partnerId = 'mh-sca-pune';
const stageLabel = (stage) => stage.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const daysInCurrentStage = (application) => {
  const current = [...application.stageHistory].reverse().find((item) => item.stage === application.stage);
  if (!current) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(current.changedAt)) / 86400000));
};

const PartnerDashboard = () => {
  const partners = useAppStore((state) => state.partners);
  const applications = useAppStore((state) => state.applications);
  const updatePartnerCapacity = useAppStore((state) => state.updatePartnerCapacity);
  const advanceApplication = useAppStore((state) => state.advanceApplication);
  const partner = partners.find((item) => item.id === partnerId) || partners[0];
  const routedLeads = useMemo(() => applications.filter((item) => item.partnerId === partner?.id), [applications, partner]);

  const updateCapacity = (capacityStatus) => {
    updatePartnerCapacity(partner.id, capacityStatus);
    toast.success('Capacity signal updated. Citizen routing now reflects this change.');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Partner staff view</p>
          <h1 className="mt-1 text-3xl font-bold dark:text-white">Channel Partner Dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">Manage branch capacity and routed applications from the same records citizens see.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <BriefcaseBusiness className="h-5 w-5 text-primary-600" />
          <span className="font-semibold dark:text-white">{partner?.name}</span>
          {partner?.isVerified && <VerifiedPartnerBadge compact />}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary-600" />
            <h2 className="font-bold dark:text-white">My Capacity</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This self-reported signal feeds the partner health score used in the locator and report card.</p>
          <div className="mt-5 grid gap-2">
            {['high', 'medium', 'low'].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => updateCapacity(status)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-bold capitalize ${partner?.healthSignal?.capacityStatus === status ? 'border-primary-500 bg-primary-50 text-primary-900 dark:bg-primary-950 dark:text-primary-100' : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
              >
                {status} capacity
              </button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 p-5 dark:border-slate-700">
            <h2 className="font-bold dark:text-white">Routed Leads</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Applications assigned to this branch, with direct stage updates.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <tr><th className="px-5 py-3">Application</th><th className="px-5 py-3">Scheme</th><th className="px-5 py-3">Stage</th><th className="px-5 py-3">Days here</th><th className="px-5 py-3">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {routedLeads.length ? routedLeads.map((application) => {
                  const scheme = schemes.find((item) => item.id === application.schemeId);
                  return (
                    <tr key={application.id} className="align-top">
                      <td className="px-5 py-4 font-bold dark:text-white">{application.id}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{scheme?.name || 'Scheme data not available yet'}</td>
                      <td className="px-5 py-4"><span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800 dark:bg-primary-950 dark:text-primary-100">{stageLabel(application.stage)}</span></td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{daysInCurrentStage(application)}</td>
                      <td className="px-5 py-4"><div className="flex flex-wrap gap-2"><Link to={`/applications/${application.id}`}><Button size="sm" variant="secondary">View</Button></Link><Button size="sm" icon={ChevronRight} disabled={application.stage === 'disbursed' || application.stage === 'pending-signature'} onClick={() => advanceApplication(application.id)}>Advance</Button></div></td>
                    </tr>
                  );
                }) : <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-500">No routed leads yet. Create an application from the partner locator to see it here.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;
