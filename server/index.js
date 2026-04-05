const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonResponse = (data, init = {}) => {
  const status = init.status ?? 200;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(JSON.stringify(data), { status, headers });
};

const emptyResponse = (status = 204, init = {}) => {
  const headers = new Headers(init.headers);
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(null, { status, headers });
};

const badRequest = (message) => jsonResponse({ error: message }, { status: 400 });

const readJson = async (request) => {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const seedMenuItems = [
  {
    id: 'm001',
    name: 'برجر سنقل لحم (Single Beef Burger)',
    description: 'شريحة لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.',
    price: 10,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm002',
    name: 'برجر دبل لحم (Double Beef Burger)',
    description: 'شريحتين لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.',
    price: 15,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm003',
    name: 'برجر تربل لحم (Triple Beef Burger)',
    description: 'ثلاث شرائح لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.',
    price: 20,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm004',
    name: 'مقلوب سنقل لحم (Upside-Down Single Beef Burger)',
    description: 'شريحة لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.',
    price: 15,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm005',
    name: 'مقلوب دبل لحم (Upside-Down Double Beef Burger)',
    description: 'شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.',
    price: 17,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm006',
    name: 'فلات بيف برجر (Flat Beef Burger)',
    description: 'شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص.',
    price: 17,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm007',
    name: 'برجر مكس لحم ودجاج (Beef & Chicken Mix Burger)',
    description: 'شريحة لحم بقري مع دجاج وجبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.',
    price: 15,
    category: 'Beef Burgers',
    image: null,
  },
  {
    id: 'm008',
    name: 'برجر سنقل دجاج مشوي (Single Grilled Chicken Burger)',
    description: 'صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.',
    price: 13,
    category: 'Chicken Burgers',
    image: null,
  },
  {
    id: 'm009',
    name: 'برجر دبل دجاج مشوي (Double Grilled Chicken Burger)',
    description: 'قطعتين صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.',
    price: 15,
    category: 'Chicken Burgers',
    image: null,
  },
  {
    id: 'm010',
    name: 'برجر سنقل دجاج كرسبي (Crispy Fried Chicken Burger)',
    description: 'صدر دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.',
    price: 13,
    category: 'Chicken Burgers',
    image: null,
  },
  {
    id: 'm011',
    name: 'برجر دبل دجاج كرسبي (Crispy Double Fried Chicken Burger)',
    description: 'قطعتين دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.',
    price: 15,
    category: 'Chicken Burgers',
    image: null,
  },
  {
    id: 'm012',
    name: 'كلوب دجاج ساندويتش (Club Chicken Sandwich)',
    description: 'ساندويتش من خبز التوست المحمص مع دجاج كرسبي وخس وصوص ويقدم مع بطاطس.',
    price: 13,
    category: 'Sandwiches',
    image: null,
  },
  {
    id: 'm013',
    name: 'كلوب لحم ساندويتش (Club Beef Sandwich)',
    description: 'ساندويتش من خبز التوست المحمص مع اللحم وصوص خاص ويقدم مع بطاطس.',
    price: 13,
    category: 'Sandwiches',
    image: null,
  },
  {
    id: 'm014',
    name: 'إندومي دجاج بالكريمة',
    description: 'خليط من الإندومي مع نكهة الكريمة والدجاج والخضار.',
    price: 10,
    category: 'Indomie',
    image: null,
  },
  {
    id: 'm015',
    name: 'إندومي دجاج صويا',
    description: 'خليط من الإندومي مع نكهة الصويا.',
    price: 10,
    category: 'Indomie',
    image: null,
  },
  {
    id: 'm016',
    name: 'إندومي شيتوس',
    description: 'خليط من الإندومي مع شيبس الشيتوس الحار.',
    price: 10,
    category: 'Indomie',
    image: null,
  },
  {
    id: 'm017',
    name: 'إندومي دجاج سبايسي',
    description: 'خليط من الإندومي مع نكهة الكريمة والدجاج والخضار الحارة.',
    price: 10,
    category: 'Indomie',
    image: null,
  },
  {
    id: 'm018',
    name: 'بطاطس مقلية',
    description: 'بطاطس بلجيكية مقلية مقرمشة.',
    price: 3,
    category: 'Fries',
    image: null,
  },
  {
    id: 'm019',
    name: 'تشيكن فرايز',
    description: 'بطاطس مقلية مع قطع دجاج مقرمش مع مزيج من الصوصات.',
    price: 10,
    category: 'Fries',
    image: null,
  },
  {
    id: 'm020',
    name: 'مكعبات بطاطس',
    description: 'مكعبات بطاطس بلجيكية مقلية مقرمشة مع الصوصات.',
    price: 10,
    category: 'Fries',
    image: null,
  },
  {
    id: 'm021',
    name: 'كلوب تشيكن ساندويتش (وجبة أطفال)',
    description: 'ساندويتش توست مع دجاج كرسبي وخس وصوص مع بطاطس ومشروب أطفال.',
    price: 14,
    category: 'Kids Meals',
    image: null,
  },
  {
    id: 'm022',
    name: 'تشيكن ناجيت',
    description: 'قطع دجاج ناجيت مع بطاطس ومشروب أطفال.',
    price: 10,
    category: 'Kids Meals',
    image: null,
  },
];

export class OrderHub {
  constructor(state) {
    this.state = state;
    this.sockets = new Set();
  }

  async ensureSeeded() {
    const existing = await this.state.storage.list({ prefix: 'menu:', limit: 1 });
    if (existing.size > 0) return;

    const batch = new Map();
    for (const it of seedMenuItems) {
      batch.set(`menu:${it.id}`, {
        _id: it.id,
        name: it.name,
        description: it.description,
        price: it.price,
        category: it.category,
        image: it.image,
      });
    }
    await this.state.storage.put(batch);
  }

  broadcast(message) {
    const encoded = JSON.stringify(message);
    for (const ws of this.sockets) {
      try {
        ws.send(encoded);
      } catch {
        this.sockets.delete(ws);
      }
    }
  }

  async listByPrefix(prefix) {
    const rows = await this.state.storage.list({ prefix });
    return [...rows.values()];
  }

  async getFromPrefix(prefix, id) {
    return await this.state.storage.get(`${prefix}${id}`);
  }

  async putToPrefix(prefix, id, value) {
    await this.state.storage.put(`${prefix}${id}`, value);
  }

  async deleteFromPrefix(prefix, id) {
    await this.state.storage.delete(`${prefix}${id}`);
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/ws' && request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];

      server.accept();
      this.sockets.add(server);

      server.addEventListener('close', () => {
        this.sockets.delete(server);
      });
      server.addEventListener('error', () => {
        this.sockets.delete(server);
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    if (request.method === 'OPTIONS') return emptyResponse(204);

    if (url.pathname === '/api/menu' && request.method === 'GET') {
      await this.ensureSeeded();
      const menu = await this.listByPrefix('menu:');
      menu.sort((a, b) => (a.category || '').localeCompare(b.category || '') || (a.name || '').localeCompare(b.name || ''));
      return jsonResponse(menu);
    }

    if (url.pathname === '/api/menu' && request.method === 'POST') {
      const body = await readJson(request);
      if (!body) return badRequest('Invalid JSON');
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      const category = typeof body.category === 'string' ? body.category.trim() : '';
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      const price = Number(body.price);
      if (!name || !category || !Number.isFinite(price)) return badRequest('Missing fields');

      const id = crypto.randomUUID();
      const item = { _id: id, name, description, price, category, image };
      await this.putToPrefix('menu:', id, item);
      return jsonResponse(item, { status: 201 });
    }

    const menuMatch = url.pathname.match(/^\/api\/menu\/([^/]+)$/);
    if (menuMatch) {
      const menuId = decodeURIComponent(menuMatch[1]);

      if (request.method === 'PUT') {
        const body = await readJson(request);
        if (!body) return badRequest('Invalid JSON');
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const description = typeof body.description === 'string' ? body.description.trim() : '';
        const category = typeof body.category === 'string' ? body.category.trim() : '';
        const image = typeof body.image === 'string' ? body.image.trim() : null;
        const price = Number(body.price);
        if (!name || !category || !Number.isFinite(price)) return badRequest('Missing fields');

        const item = { _id: menuId, name, description, price, category, image };
        await this.putToPrefix('menu:', menuId, item);
        return jsonResponse(item);
      }

      if (request.method === 'DELETE') {
        await this.deleteFromPrefix('menu:', menuId);
        return emptyResponse(204);
      }
    }

    if (url.pathname === '/api/orders' && request.method === 'GET') {
      const orders = await this.listByPrefix('order:');
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return jsonResponse(orders);
    }

    if (url.pathname === '/api/orders' && request.method === 'POST') {
      const body = await readJson(request);
      if (!body) return badRequest('Invalid JSON');

      const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
      const name = typeof body.name === 'string' ? body.name.trim() : null;
      const car = typeof body.car === 'object' && body.car ? body.car : {};
      const carName = typeof car.name === 'string' ? car.name.trim() : null;
      const carType = typeof car.type === 'string' ? car.type.trim() : null;
      const carPlate = typeof car.plate === 'string' ? car.plate.trim() : null;
      const notes = typeof body.notes === 'string' ? body.notes.trim() : null;
      const totalPrice = Number(body.totalPrice);
      const items = Array.isArray(body.items) ? body.items : [];

      if (!phone || !Number.isFinite(totalPrice) || items.length === 0) return badRequest('Missing fields');

      const orderId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const status = 'pending';

      const normalizedItems = [];
      for (const it of items) {
        const itemId = typeof it.itemId === 'string' ? it.itemId : null;
        const itemName = typeof it.name === 'string' ? it.name : '';
        const itemPrice = Number(it.price);
        const quantity = Number(it.quantity);
        if (!itemName || !Number.isFinite(itemPrice) || !Number.isFinite(quantity)) continue;
        normalizedItems.push({ itemId, name: itemName, price: itemPrice, quantity });
      }
      if (normalizedItems.length === 0) return badRequest('Missing fields');

      const order = {
        _id: orderId,
        phone,
        name,
        car: { name: carName, type: carType, plate: carPlate },
        items: normalizedItems,
        notes,
        totalPrice,
        status,
        createdAt,
      };

      await this.putToPrefix('order:', orderId, order);
      this.broadcast({ type: 'newOrder', data: order });
      return jsonResponse(order, { status: 201 });
    }

    const orderStatusMatch = url.pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (orderStatusMatch && request.method === 'PATCH') {
      const orderId = decodeURIComponent(orderStatusMatch[1]);
      const body = await readJson(request);
      if (!body) return badRequest('Invalid JSON');

      const status = typeof body.status === 'string' ? body.status.trim() : '';
      if (!['pending', 'preparing', 'ready'].includes(status)) return badRequest('Invalid status');

      const existing = await this.getFromPrefix('order:', orderId);
      if (!existing) return jsonResponse({ error: 'Not found' }, { status: 404 });

      const updated = { ...existing, status };
      await this.putToPrefix('order:', orderId, updated);
      this.broadcast({ type: 'orderUpdated', data: updated });
      return jsonResponse(updated);
    }

    return jsonResponse({ error: 'Not found' }, { status: 404 });
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return emptyResponse(204);

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/ws' || pathname.startsWith('/api/')) {
      const id = env.ORDER_HUB.idFromName('global');
      const stub = env.ORDER_HUB.get(id);
      return stub.fetch(request);
    }

    return jsonResponse({ error: 'Not found' }, { status: 404 });
  },
};
