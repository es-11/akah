CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL,
  category TEXT NOT NULL,
  image TEXT
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  name TEXT,
  car_name TEXT,
  car_type TEXT,
  car_plate TEXT,
  notes TEXT,
  total_price REAL NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  item_id TEXT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
