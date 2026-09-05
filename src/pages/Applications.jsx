import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import schemes from '../data/schemes.config.json';
import partners from '../data/partners.mock.json';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Applications = () => {
  const applications = useAppStore((state) => state.applications);
  return <div className="mx-auto max-w-4xl space-y-6 py-4"><div><p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Your journey</p><h1 className="mt-1 text-3xl font-bold dark:text-white">My applications</h1></div>{applications.length ? <div className="space-y-3">{applications.map((application) => { const scheme = schemes.find((item) => item.id === application.schemeId); const partner = partners.find((item) => item.id === application.partnerId); return <Link key={application.id} to={`/applications/${application.id}`}><Card className="p-5 transition hover:border-primary-300"><div className="flex items-start justify-between gap-3"><div><p className="font-bold dark:text-white">{scheme?.name}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{partner?.name}</p><p className="mt-2 text-xs text-slate-500">{application.id}</p></div><span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-800 dark:bg-primary-950 dark:text-primary-200">{application.stage.replace('-', ' ')}</span></div></Card></Link>; })}</div> : <Card className="p-10 text-center"><FileText className="mx-auto h-11 w-11 text-primary-600" /><h2 className="mt-3 text-xl font-bold dark:text-white">No applications yet</h2><p className="mt-2 text-slate-600 dark:text-slate-300">Choose a partner to begin your application journey.</p><Link to="/partner-locator"><Button className="mt-5" icon={Plus}>Find a partner</Button></Link></Card>}</div>;
};
export default Applications;
