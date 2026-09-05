import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History, ShieldCheck, User } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { t } = useTranslation();
  const consentHistory = useAppStore((state) => state.consentHistory);
  const revokeConsent = useAppStore((state) => state.revokeConsent);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <div><User className="h-9 w-9 text-primary-600" /><h1 className="mt-2 text-3xl font-bold dark:text-white">{t('pages.profile.title', 'Your Profile')}</h1></div>
      <Card className="p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><History className="h-5 w-5 text-primary-600" /><h2 className="font-bold dark:text-white">Your data-sharing history</h2></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Review or revoke permissions you have given for document-free verification.</p></div><Link to="/consent"><Button size="sm">Manage consent</Button></Link></div><div className="mt-5 space-y-3">{consentHistory.length ? consentHistory.map((entry) => <div key={entry.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold dark:text-white">{entry.type}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{entry.dataTypes.join(', ')}</p><p className="mt-1 text-xs text-slate-500">Expires {new Date(entry.expiresAt).toLocaleDateString()}</p></div>{entry.revoked ? <span className="text-sm font-semibold text-slate-500">Revoked</span> : <Button size="sm" variant="secondary" onClick={() => revokeConsent(entry.id)}>Revoke</Button>}</div></div>) : <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"><ShieldCheck className="mx-auto mb-2 h-7 w-7 text-primary-600" />You have not shared any data yet.</div>}</div></Card>
    </div>
  );
};

export default Profile;
