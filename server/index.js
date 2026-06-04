import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getSupabaseConfigError, isSupabaseConfigured, supabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const SERVER_PUBLIC_URL = (process.env.SERVER_PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.vercel.app') ||
      origin === 'https://karana-agency.vercel.app'
    ) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(publicDir));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'index.html'));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const requireDatabase = (res) => {
  if (isSupabaseConfigured && supabase) return true;
  res.status(503).json({
    message: 'Database is not configured',
    setup: getSupabaseConfigError(),
  });
  return false;
};

const sendDatabaseError = (res, error, fallback = 'Database request failed') => {
  console.error(fallback, error);
  res.status(500).json({
    message: fallback,
    details: error?.message || 'Check your Supabase URL, service role key, schema, and network access.',
  });
};

const productFromDb = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  price: Number(row.price || 0),
  thumbnail: row.thumbnail,
  options: row.options || [],
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const productToDb = (body) => ({
  title: body.title,
  description: body.description || '',
  category: body.category,
  price: Number(body.price || 0),
  thumbnail: body.thumbnail || '/placeholder.svg',
  options: Array.isArray(body.options) ? body.options : [],
});

const orderFromDb = (row) => ({
  id: row.id,
  productId: row.product_id,
  productTitle: row.product_title,
  price: Number(row.price || 0),
  option: row.option,
  billingAddress: row.billing_address,
  contact: row.contact,
  customisation: row.customisation,
  paymentMethod: row.payment_method,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const orderToDb = (body) => ({
  product_id: body.productId,
  product_title: body.productTitle,
  price: Number(body.price || 0),
  option: body.option,
  billing_address: body.billingAddress || {},
  contact: body.contact || null,
  customisation: body.customisation || null,
  payment_method: body.paymentMethod,
  status: body.status || 'paid',
});

const serviceOrderFromDb = (row) => ({
  id: row.id,
  type: row.type,
  name: row.name,
  email: row.email,
  phone: row.phone,
  company: row.company,
  service: row.service,
  details: row.details,
  material: row.material,
  color: row.color,
  infill: row.infill,
  extraInfo: row.extra_info,
  hearAbout: row.hear_about,
  modelFile: row.model_file,
  modelFilename: row.model_filename,
  timeline: row.timeline,
  source: row.source,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const serviceOrderToDb = (body) => ({
  type: body.type,
  name: body.name,
  email: body.email,
  phone: body.phone || null,
  company: body.company || null,
  service: body.service || null,
  details: body.details || null,
  material: body.material || null,
  color: body.color || null,
  infill: body.infill ?? null,
  extra_info: body.extraInfo || null,
  hear_about: body.hearAbout || null,
  model_file: body.modelFile || null,
  model_filename: body.modelFilename || null,
  timeline: body.timeline || null,
  source: body.source || null,
  status: body.status || 'new',
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: isSupabaseConfigured ? 'configured' : 'missing-env',
  });
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'Srinivasakalyanam';
  if (password === adminPassword) {
    res.json({ success: true, token: 'sk-admin-token-' + Date.now() });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.get('/api/products', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendDatabaseError(res, error, 'Failed to fetch products');
  res.json((data || []).map(productFromDb));
});

app.get('/api/products/:id', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to fetch product');
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json(productFromDb(data));
});

app.post('/api/products', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('products')
    .insert(productToDb(req.body))
    .select()
    .single();

  if (error) return sendDatabaseError(res, error, 'Failed to create product');
  res.status(201).json(productFromDb(data));
});

app.put('/api/products/:id', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('products')
    .update(productToDb(req.body))
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to update product');
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json(productFromDb(data));
});

app.delete('/api/products/:id', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to delete product');
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json({ success: true });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `${SERVER_PUBLIC_URL}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.originalname });
});

app.get('/api/orders', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendDatabaseError(res, error, 'Failed to fetch orders');
  res.json((data || []).map(orderFromDb));
});

app.post('/api/orders', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('orders')
    .insert(orderToDb(req.body))
    .select()
    .single();

  if (error) return sendDatabaseError(res, error, 'Failed to create order');
  res.status(201).json(orderFromDb(data));
});

app.put('/api/orders/:id/status', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('orders')
    .update({ status: req.body.status })
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to update order status');
  if (!data) return res.status(404).json({ message: 'Order not found' });
  res.json(orderFromDb(data));
});

app.get('/api/service-orders', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendDatabaseError(res, error, 'Failed to fetch service orders');
  res.json((data || []).map(serviceOrderFromDb));
});

app.post('/api/service-orders', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('service_orders')
    .insert(serviceOrderToDb(req.body))
    .select()
    .single();

  if (error) return sendDatabaseError(res, error, 'Failed to create service order');
  res.status(201).json(serviceOrderFromDb(data));
});

app.put('/api/service-orders/:id/status', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('service_orders')
    .update({ status: req.body.status })
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to update service order status');
  if (!data) return res.status(404).json({ message: 'Service order not found' });
  res.json(serviceOrderFromDb(data));
});

app.get('/api/settings', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase.from('settings').select('key, value');

  if (error) return sendDatabaseError(res, error, 'Failed to fetch settings');
  res.json(Object.fromEntries((data || []).map((row) => [row.key, row.value])));
});

app.get('/api/settings/3dprint-colors', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', '3dprint-colors')
    .maybeSingle();

  if (error) return sendDatabaseError(res, error, 'Failed to fetch 3D print colors');
  res.json(data?.value || {});
});

app.put('/api/settings/3dprint-colors', async (req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase
    .from('settings')
    .upsert({ key: '3dprint-colors', value: req.body }, { onConflict: 'key' })
    .select('value')
    .single();

  if (error) return sendDatabaseError(res, error, 'Failed to save 3D print colors');
  res.json(data.value);
});

app.listen(PORT, () => {
  console.log(`Karana Backend Server running on http://localhost:${PORT}`);
  if (!isSupabaseConfigured) {
    console.warn(getSupabaseConfigError());
  }
});
