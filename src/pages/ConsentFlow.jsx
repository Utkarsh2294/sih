import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Landmark, LockKeyhole, ShieldCheck, WalletCards } from 'lucide-react';
import { requestAAConsent, requestDigiLockerPull } from '../services/consentService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const choices = [
  { id: 'income-cash-flow', provider: 'Account Aggregator', title: 'Income and cash-flow', description: 'Used only to verify your ability to repay this specific application.', icon: WalletCards },
  { id: 'caste-certificate', provider: 'DigiLocker', title: 'Caste certificate', description: 'Used only to confirm scheme eligibility for this specific application.', icon: ShieldCheck },
  { id: 'aadhaar', provider: 'DigiLocker', title: 'Aadhaar identity proof', description: 'Used only to verify your identity for this specific application.', icon: Landmark },
  { id: 'education-certificates', provider: 'DigiLocker', title: 'Education certificates', description: 'Used only when your selected scheme requires education details.', icon: CheckCircle2 },
];

const ConsentFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState('choose');
  const [saving, setSaving] = useState(false);
  const selectedChoices = useMemo(() => choices.filter((choice) => selected.includes(choice.id)), [selected]);
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const confirm = async () => {
    setSaving(true);
    const aa = selectedChoices.filter((item) => item.provider === 'Account Aggregator').map((item) => item.title);
    const digiLocker = selectedChoices.filter((item) => item.provider === 'DigiLocker').map((item) => item.title);
    if (aa.length) await requestAAConsent('Verify affordability for your selected application', aa);
    if (digiLocker.length) await requestDigiLockerPull(digiLocker);
    setSaving(false); setStep('done');
  };
  if (step === 'done') return <div className="mx-auto max-w-2xl py-8"><Card className="p-8 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><h1 className="mt-4 text-2xl font-bold dark:text-white">Your consent is recorded</h1><p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-300">Only the data you selected can be used, for this purpose, until your application is decided or for 90 days — whichever comes first. You can revoke access any time from your profile.</p><Button className="mt-6" onClick={() => navigate(applicationId ? `/applications/${applicationId}` : '/profile')}>{applicationId ? 'Continue to Application' : 'View data-sharing history'}</Button></Card></div>;
  return <div className="mx-auto max-w-2xl space-y-5 py-3"><div><p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Zero-document onboarding</p><h1 className="mt-1 text-3xl font-bold dark:text-white">Share only what you choose</h1><p className="mt-2 text-slate-600 dark:text-slate-300">You do not need to hunt for paperwork. Choose exactly which data we may request; nothing is selected by default.</p></div>{step === 'choose' ? <><div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-950 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100"><LockKeyhole className="mr-2 inline h-5 w-5" /><b>Purpose-limited and revocable.</b> Each permission expires in 90 days or when the application is decided, whichever comes first.</div><div className="space-y-3">{choices.map((choice) => { const Icon = choice.icon; const isSelected = selected.includes(choice.id); return <Card key={choice.id} className="p-4"><label className="flex cursor-pointer gap-4"><input type="checkbox" checked={isSelected} onChange={() => toggle(choice.id)} className="mt-1 h-5 w-5 accent-primary-600" /><Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" /><span><span className="block font-semibold dark:text-white">{choice.title}</span><span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{choice.description}</span><span className="mt-2 block text-xs font-medium text-slate-500">Via {choice.provider} · Expires in 90 days</span></span></label></Card>; })}</div><div className="flex gap-3"><Button variant="ghost" onClick={() => navigate(-1)}>Back</Button><Button disabled={!selected.length} onClick={() => setStep('review')}>Review selected data</Button></div></> : <><Card className="p-5"><h2 className="text-xl font-bold dark:text-white">Confirm what you will share</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">We will request only the items below for the selected application. No data is shared until you confirm.</p><ul className="mt-4 space-y-2">{selectedChoices.map((item) => <li className="flex items-center gap-2 text-sm dark:text-slate-200" key={item.id}><CheckCircle2 className="h-5 w-5 text-emerald-600" />{item.title} via {item.provider}</li>)}</ul></Card><div className="flex gap-3"><Button variant="ghost" onClick={() => setStep('choose')}>Edit choices</Button><Button loading={saving} onClick={confirm}>Confirm consent</Button></div></>}</div>;
};
export default ConsentFlow;
