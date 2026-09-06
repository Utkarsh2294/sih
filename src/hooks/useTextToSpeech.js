import { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';

const useTextToSpeech = (text) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const language = useAppStore((state) => state.language);
  const ttsEnabled = useAppStore((state) => state.ttsEnabled);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = () => {
    if (!ttsEnabled || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
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
