import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, CheckCircle2, Flame } from 'lucide-react';
import lessons from '../data/lessons.mock.json';
import useAppStore from '../store/useAppStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressRing from '../components/ui/ProgressRing';

const VittGyan = () => {
  const completedLessonIds = useAppStore((state) => state.completedLessonIds);
  const currentStreakDays = useAppStore((state) => state.currentStreakDays);
  const completeLesson = useAppStore((state) => state.completeLesson);
  const [activeLesson, setActiveLesson] = useState(null);
  const [slide, setSlide] = useState(0);
  const [answer, setAnswer] = useState('');
  const completed = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);

  if (activeLesson) {
    const totalSlides = activeLesson.slides.length;
    const checking = slide >= totalSlides;
    const finish = () => {
      completeLesson(activeLesson.id);
      setActiveLesson(null);
      setSlide(0);
      setAnswer('');
    };
    return <div className="mx-auto max-w-3xl py-4">
      <Button variant="ghost" onClick={() => setActiveLesson(null)}>Back to lessons</Button>
      <Card className="mt-4 overflow-hidden p-0">
        <div className="flex gap-1 p-3">{activeLesson.slides.map((_, index) => <div key={index} className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"><motion.div className="h-full rounded-full bg-primary-600" animate={{ width: index < slide ? '100%' : index === slide ? '70%' : '0%' }} /></div>)}</div>
        <button type="button" onClick={(event) => { const left = event.clientX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.offsetWidth / 2; setSlide((value) => Math.max(0, Math.min(totalSlides, value + (left ? -1 : 1)))); }} className="min-h-[360px] w-full px-6 py-10 text-left">
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{activeLesson.durationSeconds} seconds · {activeLesson.tags.join(', ')}</p>
          <h1 className="mt-3 text-3xl font-bold dark:text-white">{activeLesson.title}</h1>
          {!checking ? <motion.p key={slide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-2xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{activeLesson.slides[slide]}</motion.p> : <div className="mt-8 space-y-4"><h2 className="text-xl font-bold dark:text-white">{activeLesson.question}</h2><div className="flex flex-wrap gap-2">{activeLesson.options.map((option) => <button type="button" key={option} onClick={(event) => { event.stopPropagation(); setAnswer(option); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${answer === option ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}>{option}</button>)}</div><Button disabled={answer !== activeLesson.answer} onClick={(event) => { event.stopPropagation(); finish(); }}>Mark lesson complete</Button></div>}
        </button>
      </Card>
    </div>;
  }

  return <div className="mx-auto max-w-6xl space-y-6 py-4">
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <div><p className="text-sm font-semibold text-primary-700 dark:text-primary-300">VittGyan</p><h1 className="mt-1 text-3xl font-bold dark:text-white">Small money lessons, one step at a time</h1><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">Tap through short lessons on interest, documents, partner choice, safety, and signing.</p></div>
      <Card className="flex items-center gap-4 p-4"><ProgressRing value={Math.min(100, currentStreakDays * 25)} label={`${currentStreakDays}d`} size={72} /><div><p className="font-bold dark:text-white">Learning streak</p><p className="text-sm text-slate-600 dark:text-slate-300">Complete one lesson daily to keep it alive.</p></div></Card>
    </div>
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-800 dark:bg-primary-950 dark:text-primary-200"><Flame className="h-4 w-4" />{currentStreakDays >= 3 ? '3-day streak earned' : '3-day streak locked'}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-3 py-1 text-sm font-bold text-accent-900 dark:bg-accent-950 dark:text-accent-100"><Award className="h-4 w-4" />{completed.size === lessons.length ? 'All lessons complete' : `${completed.size}/${lessons.length} complete`}</span>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{lessons.map((lesson) => {
      const done = completed.has(lesson.id);
      return <Card key={lesson.id} className="p-5"><div className="flex items-start justify-between gap-3"><BookOpen className="h-6 w-6 text-primary-600" /><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${done ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{done ? 'Completed' : 'Available'}</span></div><h2 className="mt-4 text-lg font-bold dark:text-white">{lesson.title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.durationSeconds} seconds · {lesson.tags[0]}</p><Button className="mt-5 w-full" icon={done ? CheckCircle2 : BookOpen} onClick={() => setActiveLesson(lesson)}>{done ? 'Review lesson' : 'Start lesson'}</Button></Card>;
    })}</div>
  </div>;
};

export default VittGyan;
