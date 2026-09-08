import { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { synthesizeSpeech } from '../services/bhashiniService';

const useTextToSpeech = (text) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const language = useAppStore((state) => state.language);
  const ttsEnabled = useAppStore((state) => state.ttsEnabled);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = async () => {
    if (!ttsEnabled || !text) return;
    window.speechSynthesis?.cancel();
    try {
      setIsSpeaking(true);
      const audioUrl = await synthesizeSpeech({ text, language });
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
      return;
    } catch (error) { console.warn('Bhashini speech unavailable; using device voice instead.', error); }
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return { speak, isSpeaking };
};

export default useTextToSpeech;
