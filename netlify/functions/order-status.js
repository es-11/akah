const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const parseJson = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const requireAdmin = (event) => {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return null;
  const token = event.headers['x-admin-token'] || event.headers['X-Admin-Token'] || '';
  return token === expected ? null : 'Unauthorized';
};

const supabaseRequest = async (path, init) => {
  const baseUrl = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!baseUrl || !serviceKey) return { ok: false, status: 500, json: async () => ({ error: 'Missing Supabase env' }) };

  const url = `${baseUrl.replace(/\/$/, '')}/rest/v1${path}`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...init.headers,
  };
  return fetch(url, { ...init, headers });
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const authError = requireAdmin(event);
  if (authError) return json(401, { error: authError });

  if (event.httpMethod !== 'PATCH') return json(405, { error: 'Method not allowed' });

  const body = parseJson(event.body);
  if (!body) return json(400, { error: 'Invalid JSON' });

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const status = typeof body.status === 'string' ? body.status.trim() : '';
  if (!id || !['pending', 'preparing', 'ready'].includes(status)) return json(400, { error: 'Invalid payload' });

  const res = await supabaseRequest(`/orders?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) return json(res.status, data || { error: 'Supabase error' });
  return json(200, data);
};
