import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { getAssistantResponse } from '../../services/assistantService';
import BottomSheet from '../ui/BottomSheet';

const initialMessages = [{ id: 'welcome', role: 'assistant', text: 'Namaste! Ask me about schemes, EMI, or loan terms.', time: new Date() }];

const AssistantLauncher = () => {
  const navigate = useNavigate();
  const language = useAppStore((state) => state.language);
  const muted = useAppStore((state) => state.assistantMuted);
  const setMuted = useAppStore((state) => state.setAssistantMuted);
  const [open, setOpen] = useState(false); const [messages, setMessages] = useState(initialMessages); const [draft, setDraft] = useState('');
  const [listening, setListening] = useState(false); const [supported, setSupported] = useState(false); const recognitionRef = useRef(null); const threadRef = useRef(null);
  useEffect(() => { setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)); }, []);
  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, open]);
  const speak = (text) => { if (!muted && window.speechSynthesis) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'; window.speechSynthesis.speak(utterance); } };
  const send = async (message = draft) => {
    const clean = message.trim(); if (!clean) return;
    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: 'user', text: clean, time: new Date() }]); setDraft('');
    const reply = await getAssistantResponse(clean);
    setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: 'assistant', text: reply.reply, time: new Date() }]); speak(reply.reply);
    if (reply.action) setTimeout(() => navigate(reply.action), 700);
  };
  const startListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return;
    const recognition = new Recognition(); recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => setListening(true); recognition.onresult = (event) => { const transcript = Array.from(event.results).map((result) => result[0].transcript).join(''); setDraft(transcript); if (event.results[event.results.length - 1].isFinal) send(transcript); }; recognition.onend = () => setListening(false); recognition.onerror = () => setListening(false); recognitionRef.current = recognition; recognition.start();
  };
  return <><button type="button" onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus-visible:ring-4 focus-visible:ring-primary-300 md:bottom-6 md:right-6" aria-label="Open VittSetu assistant"><Bot className="h-6 w-6" /></button><BottomSheet isOpen={open} onClose={() => { recognitionRef.current?.stop(); setOpen(false); }} title="VittSetu assistant"><div className="flex h-[65vh] flex-col"><div className="mb-3 flex items-center justify-between rounded-xl bg-primary-50 p-3 text-sm text-primary-900 dark:bg-primary-950/40 dark:text-primary-100"><span>Ask in your own words. Your chat is not saved as an application.</span><button className="ml-3 rounded p-1 hover:bg-primary-100" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn voice replies on' : 'Turn voice replies off'}>{muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button></div><div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto pr-1">{messages.map((message) => <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'ml-auto bg-accent-500 text-accent-950' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}><p>{message.text}</p><span className="mt-1 block text-[10px] opacity-60">{message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></motion.div>)}</div><form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Type your question" aria-label="Type your question" />{supported && <button type="button" onClick={startListening} className={`min-h-12 min-w-12 rounded-xl border ${listening ? 'border-red-500 bg-red-100 text-red-700 animate-pulse' : 'border-primary-600 text-primary-700 dark:text-primary-300'}`} aria-label="Speak your question">{listening ? <MicOff className="mx-auto h-5 w-5" /> : <Mic className="mx-auto h-5 w-5" />}</button>}<button className="min-h-12 min-w-12 rounded-xl bg-primary-600 text-white hover:bg-primary-700" aria-label="Send question"><Send className="mx-auto h-5 w-5" /></button></form>{!supported && <p className="mt-2 text-xs text-slate-500">Voice input is not supported in this browser. You can still type your question.</p>}</div></BottomSheet></>;
};
export default AssistantLauncher;
