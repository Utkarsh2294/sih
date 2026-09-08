const request = async (path, body) => {
  const response = await fetch(`/api/bhashini/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Bhashini request failed.');
  return data;
};

export const getBhashiniStatus = async () => {
  const response = await fetch('/api/bhashini/status');
  return response.ok && (await response.json()).configured;
};

export const translateTexts = async ({ texts, sourceLanguage = 'en', targetLanguage }) => (await request('translate', { texts, sourceLanguage, targetLanguage })).translations;
export const synthesizeSpeech = async ({ text, language }) => (await request('tts', { text, language })).audio;

const flattenStrings = (value, path = [], result = []) => {
  if (typeof value === 'string') result.push({ path, value });
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => flattenStrings(child, [...path, key], result));
  return result;
};

const setAtPath = (target, path, value) => {
  if (path.length === 1) target[path[0]] = value;
  else { target[path[0]] = target[path[0]] || {}; setAtPath(target[path[0]], path.slice(1), value); }
};

export const translateResourceBundle = async ({ resource, targetLanguage }) => {
  const entries = flattenStrings(resource);
  const translations = await translateTexts({ texts: entries.map((entry) => entry.value), targetLanguage });
  return entries.reduce((bundle, entry, index) => { setAtPath(bundle, entry.path, translations[index]); return bundle; }, {});
};
