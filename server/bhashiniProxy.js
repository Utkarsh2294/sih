const CONFIG_ENDPOINT = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
const languageAliases = { gom: 'kok' };
const languageCode = (language) => languageAliases[language] || language;

const readJson = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON request body.')); } });
  request.on('error', reject);
});

const sendJson = (response, status, body) => { response.statusCode = status; response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(body)); };
const getSettings = () => ({ userId: process.env.BHASHINI_USER_ID, apiKey: process.env.BHASHINI_API_KEY, pipelineId: process.env.BHASHINI_PIPELINE_ID });

const configureTask = async (taskType, sourceLanguage, targetLanguage) => {
  const settings = getSettings();
  if (!settings.userId || !settings.apiKey || !settings.pipelineId) throw new Error('Bhashini is not configured on this server.');
  const task = { taskType, config: { language: { sourceLanguage: languageCode(sourceLanguage) } } };
  if (targetLanguage) task.config.language.targetLanguage = languageCode(targetLanguage);
  const response = await fetch(CONFIG_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', userID: settings.userId, ulcaApiKey: settings.apiKey }, body: JSON.stringify({ pipelineTasks: [task], pipelineRequestConfig: { pipelineId: settings.pipelineId } }) });
  if (!response.ok) throw new Error(`Bhashini configuration failed (${response.status}).`);
  const config = await response.json(); const taskConfig = config.pipelineResponseConfig?.[0]?.config?.[0]; const endpoint = config.pipelineInferenceAPIEndPoint;
  if (!taskConfig?.serviceId || !endpoint?.callbackUrl || !endpoint?.inferenceApiKey) throw new Error('Bhashini did not return a usable model for this request.');
  return { task, taskConfig, endpoint };
};

const runTask = async (taskType, sourceLanguage, targetLanguage, input) => {
  const { task, taskConfig, endpoint } = await configureTask(taskType, sourceLanguage, targetLanguage);
  const response = await fetch(endpoint.callbackUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', [endpoint.inferenceApiKey.name]: endpoint.inferenceApiKey.value }, body: JSON.stringify({ pipelineTasks: [{ ...task, config: { ...task.config, serviceId: taskConfig.serviceId } }], inputData: { input } }) });
  if (!response.ok) throw new Error(`Bhashini request failed (${response.status}).`);
  return response.json();
};

export const bhashiniProxy = async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/status') return sendJson(response, 200, { configured: Boolean(getSettings().userId && getSettings().apiKey && getSettings().pipelineId) });
    if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
    const body = await readJson(request);
    if (request.url === '/translate') { const result = await runTask('translation', body.sourceLanguage || 'en', body.targetLanguage, (body.texts || []).map((source) => ({ source }))); const output = result.pipelineResponse?.[0]?.output || []; return sendJson(response, 200, { translations: output.map((item) => item.target || item.translation || item.source) }); }
    if (request.url === '/tts') { const result = await runTask('tts', body.language, null, [{ source: body.text }]); const audio = result.pipelineResponse?.[0]?.audio?.[0]?.audioContent || result.pipelineResponse?.[0]?.output?.[0]?.audioContent || result.pipelineResponse?.[0]?.output?.[0]?.audio; if (!audio) throw new Error('Bhashini did not return speech audio for this language.'); return sendJson(response, 200, { audio: `data:audio/wav;base64,${audio}` }); }
    return sendJson(response, 404, { error: 'Unknown Bhashini route.' });
  } catch (error) { return sendJson(response, 502, { error: error.message || 'Bhashini request failed.' }); }
};
