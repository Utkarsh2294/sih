import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Volume2, Languages, ClipboardCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReadAloudButton from '../components/ReadAloudButton';

const copy = 'Planned feature: give a missed call and VittSetu would call back with scheme guidance in your language. No smartphone or data pack would be required.';

const FeaturePhoneHelp = () => (
  <div className="mx-auto max-w-4xl space-y-6 py-4">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Planned feature</p><h1 className="mt-1 text-3xl font-bold dark:text-white">Feature-phone help by missed call</h1><p className="mt-2 text-slate-600 dark:text-slate-300">{copy}</p></div>
      <ReadAloudButton text={copy} />
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {[['1', PhoneCall, 'Give a missed call', 'A future toll-free number would call you back automatically.'], ['2', Languages, 'Choose language', 'The voice flow would speak in Hindi, Marathi, or another supported language.'], ['3', Volume2, 'Answer by keypad or voice', 'Simple prompts would collect purpose, income range, district, and loan need.'], ['4', ClipboardCheck, 'Get the recommendation', 'The call would read the matching scheme and nearest suitable partner.']].map(([step, Icon, title, text]) => <Card className="p-5" key={step}><Icon className="h-7 w-7 text-primary-600" /><p className="mt-4 text-sm font-bold text-accent-700 dark:text-accent-300">Step {step}</p><h2 className="mt-1 font-bold dark:text-white">{title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p></Card>)}
    </div>
    <Card className="border-dashed border-accent-300 bg-accent-50 p-5 dark:border-accent-800 dark:bg-accent-950/30">
      <p className="font-bold text-accent-950 dark:text-accent-100">Prototype note</p>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">This screen explains the IVR concept only. No live phone system is connected in this demo.</p>
    </Card>
    <Link to="/"><Button variant="secondary">Back home</Button></Link>
  </div>
);

export default FeaturePhoneHelp;
