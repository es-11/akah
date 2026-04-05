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

  const method = event.httpMethod;
  const body = parseJson(event.body);

  if (method === 'POST') {
    if (!body) return json(400, { error: 'Invalid JSON' });
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    const price = Number(body.price);
    if (!name || !category || !Number.isFinite(price)) return json(400, { error: 'Missing fields' });

    const res = await supabaseRequest('/menu_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ name, description, price, category, image }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return json(res.status, data || { error: 'Supabase error' });
    return json(200, data);
  }

  if (method === 'PUT') {
    if (!body) return json(400, { error: 'Invalid JSON' });
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    const price = Number(body.price);
    if (!id || !name || !category || !Number.isFinite(price)) return json(400, { error: 'Missing fields' });

    const res = await supabaseRequest(`/menu_items?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ name, description, price, category, image }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return json(res.status, data || { error: 'Supabase error' });
    return json(200, data);
  }

  if (method === 'DELETE') {
    if (!body) return json(400, { error: 'Invalid JSON' });
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) return json(400, { error: 'Missing id' });

    const res = await supabaseRequest(`/menu_items?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return json(res.status, data || { error: 'Supabase error' });
    return json(200, data || { ok: true });
  }

  return json(405, { error: 'Method not allowed' });
};
