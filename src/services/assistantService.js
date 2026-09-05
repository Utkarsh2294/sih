const intents = [
  { match: /moratorium/i, reply: 'A moratorium is a short period before regular EMI payments begin. Depending on the scheme, interest may still apply during that time.' },
  { match: /\bemi\b/i, reply: 'EMI means Equated Monthly Instalment: the fixed amount you pay each month toward your loan.' },
  { match: /find.*scheme|scheme.*help/i, reply: 'I can help you find a scheme. I will take you to the scheme finder so we can check a few simple details.', action: '/scheme-recommender' },
  { match: /application|track/i, reply: 'Your application tracker will show updates once you start an application with a partner.', action: '/applications' },
  { match: /hello|hi|namaste/i, reply: 'Namaste! I can explain loan terms, help you find a scheme, or point you to your application.' },
];

// Swappable boundary for a future Bhashini/LLM backend.
export const getAssistantResponse = async (message) => {
  const matched = intents.find((intent) => intent.match.test(message));
  return matched || { reply: 'I am not sure about that yet. Would you like to call our help line at 1800-000-1212?' };
};
