import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Layers, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  LogOut, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  X,
  Lock,
  FolderOpen,
  Upload,
  Inbox,
  Settings,
  Printer,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react';

const API = 'http://localhost:4000';
const POLL_INTERVAL = 15000; // 15-second auto-refresh for service orders

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Websites' | 'Robotic Projects' | 'IoT Projects' | 'UI/UX Design';
  price: number;
  thumbnail: string;
  options: string[];
}

interface Order {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  option: 'purchase' | 'customise';
  billingAddress: { name: string; street: string; city: string; state: string; pincode: string; country: string };
  contact?: { email: string; phone: string };
  customisation?: { description: string; deadline: string; fileUrl?: string; filename?: string };
  paymentMethod: 'Gpay' | 'Paytm';
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'paid';
  created_at: string;
}

interface ServiceOrder {
  id: string;
  type: '3d-printing' | 'contact';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  details?: string;
  material?: string;
  color?: string;
  infill?: number;
  extraInfo?: string;
  hearAbout?: string;
  modelFile?: string;
  modelFilename?: string;
  timeline?: string;
  source?: string;
  status: 'new' | 'in-progress' | 'completed' | 'rejected';
  created_at: string;
  updated_at?: string;
}

type PrintColors = Record<string, string[]>;

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('karana_admin_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [printColors, setPrintColors] = useState<PrintColors>({});
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'products' | 'orders' | 'service-orders' | 'settings'>('dashboard');

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '', description: '', category: 'Websites' as Product['category'],
    price: 0, thumbnail: '', purchase: true, customise: true
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Order modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);

  // Settings: colour management
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [newColorInput, setNewColorInput] = useState('');

  // ── Fetch all data ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setApiError(null);
    try {
      const [prodRes, ordRes, svcRes, colRes] = await Promise.all([
        fetch(`${API}/api/products`),
        fetch(`${API}/api/orders`),
        fetch(`${API}/api/service-orders`),
        fetch(`${API}/api/settings/3dprint-colors`),
      ]);

      if (!prodRes.ok || !ordRes.ok || !svcRes.ok) throw new Error('Failed to retrieve server data');

      setProducts(await prodRes.json());
      setOrders(await ordRes.json());
      setServiceOrders(await svcRes.json());
      if (colRes.ok) setPrintColors(await colRes.json());
    } catch (err) {
      console.error(err);
      setApiError('Unable to connect to the backend server at localhost:4000. Make sure it is running.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh service orders every 15s
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => fetchData(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [token, fetchData]);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error('Auth rejected');
      const data = await res.json();
      localStorage.setItem('karana_admin_token', data.token);
      setToken(data.token);
    } catch {
      setLoginError('Incorrect password credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('karana_admin_token');
    setToken(null);
  };

  // ── Product CRUD ─────────────────────────────────────────────────────────────
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const optionsArray = [];
    if (productForm.purchase) optionsArray.push('purchase');
    if (productForm.customise) optionsArray.push('customise');
    const payload = {
      title: productForm.title, description: productForm.description,
      category: productForm.category, price: Number(productForm.price),
      thumbnail: productForm.thumbnail || '/placeholder.svg', options: optionsArray
    };
    try {
      const url = editingProduct ? `${API}/api/products/${editingProduct.id}` : `${API}/api/products`;
      const res = await fetch(url, { method: editingProduct ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ title: '', description: '', category: 'Websites', price: 0, thumbnail: '', purchase: true, customise: true });
      fetchData();
    } catch { alert('Product creation/modification failed'); }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title, description: product.description, category: product.category,
      price: product.price, thumbnail: product.thumbnail,
      purchase: product.options.includes('purchase'), customise: product.options.includes('customise')
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch { alert('Could not delete product'); }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      try {
        const res = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProductForm(prev => ({ ...prev, thumbnail: data.url }));
      } catch { alert('File upload failed'); }
      finally { setUploadingFile(false); }
    }
  };

  // ── Order status update ──────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (id: string, newStatus: Order['status']) => {
    try {
      await fetch(`${API}/api/orders/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
      });
      fetchData();
      if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch { alert('Could not update order status'); }
  };

  // ── Service order status update ──────────────────────────────────────────────
  const handleUpdateServiceOrderStatus = async (id: string, newStatus: ServiceOrder['status']) => {
    try {
      await fetch(`${API}/api/service-orders/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
      });
      fetchData();
      if (selectedServiceOrder?.id === id) setSelectedServiceOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch { alert('Could not update service order status'); }
  };

  // ── 3D Print colour management ───────────────────────────────────────────────
  const handleAddColor = async (material: string) => {
    const color = newColorInput.trim();
    if (!color) return;
    const updated = { ...printColors, [material]: [...(printColors[material] || []), color] };
    await savePrintColors(updated);
    setNewColorInput('');
  };

  const handleRemoveColor = async (material: string, color: string) => {
    const updated = { ...printColors, [material]: (printColors[material] || []).filter(c => c !== color) };
    await savePrintColors(updated);
  };

  const savePrintColors = async (colors: PrintColors) => {
    try {
      const res = await fetch(`${API}/api/settings/3dprint-colors`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(colors)
      });
      if (res.ok) setPrintColors(colors);
    } catch { alert('Failed to save colour settings'); }
  };

  // ── Computed stats ───────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const newServiceOrdersCount = serviceOrders.filter(o => o.status === 'new').length;

  // ── Status badge helper ──────────────────────────────────────────────────────
  const svcStatusBadge = (status: ServiceOrder['status']) => {
    const map: Record<string, string> = {
      'new': 'badge-gold',
      'in-progress': 'badge-blue',
      'completed': 'badge-green',
      'rejected': 'badge-red',
    };
    return map[status] || 'badge-blue';
  };

  // ─── Login Screen ─────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="login-container">
        <div className="bg-particles" />
        <div className="bg-glow-sphere" />
        <div className="login-card glass-card">
          <div className="login-header">
            <div className="login-logo">K</div>
            <h2 className="login-title">KARANA ADMIN</h2>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Cryptographic Secure Portal</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password Key</label>
              <div style={{ position: 'relative' }}>
                <input required type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cosmic-input text-center"
                  placeholder="Enter access key"
                  style={{ letterSpacing: '4px' }}
                />
                <Lock className="w-4 h-4 text-white/30" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            {loginError && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-montserrat text-center mb-6">
                {loginError}
              </div>
            )}
            <button type="submit" disabled={isLoggingIn} className="btn btn-primary w-full" style={{ padding: '16px' }}>
              {isLoggingIn ? 'Authenticating...' : 'Authenticate Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Main Admin Layout ────────────────────────────────────────────────────────
  return (
    <div className="admin-layout">
      <div className="bg-particles" />
      <div className="bg-glow-sphere" />

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <a href="#" className="sidebar-logo">
            <div className="logo-icon">K</div>
            <span>KARANA ADMIN</span>
          </a>
          <nav className="sidebar-menu">
            <button onClick={() => setCurrentTab('dashboard')} className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}>
              <Layers className="w-4 h-4" /> System Dashboard
            </button>
            <button onClick={() => setCurrentTab('products')} className={`sidebar-link ${currentTab === 'products' ? 'active' : ''}`}>
              <ShoppingBag className="w-4 h-4" /> Manage Catalog
            </button>
            <button onClick={() => setCurrentTab('orders')} className={`sidebar-link ${currentTab === 'orders' ? 'active' : ''}`}>
              <FileText className="w-4 h-4" /> Order Pipelines
            </button>
            <button onClick={() => setCurrentTab('service-orders')} className={`sidebar-link ${currentTab === 'service-orders' ? 'active' : ''}`}>
              <Inbox className="w-4 h-4" /> Service Orders
              {newServiceOrdersCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#9CA6B7', color: '#070B12', fontSize: '10px', fontWeight: 900, padding: '2px 7px', borderRadius: '99px' }}>
                  {newServiceOrdersCount}
                </span>
              )}
            </button>
            <button onClick={() => setCurrentTab('settings')} className={`sidebar-link ${currentTab === 'settings' ? 'active' : ''}`}>
              <Settings className="w-4 h-4" /> Service Settings
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} className="sidebar-link hover:text-red-400">
          <LogOut className="w-4 h-4" /> Close Admin Portal
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {apiError && (
          <div className="glass-card mb-8" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="text-white font-bold mb-1">Server Connection Dropped</h4>
              <p className="text-white/60 text-xs">{apiError}</p>
            </div>
            <button onClick={() => fetchData()} className="btn btn-secondary ml-auto text-xs">Reconnect</button>
          </div>
        )}

        {/* ── DASHBOARD ────────────────────────────────────────────────────── */}
        {currentTab === 'dashboard' && (
          <div>
            <h1 className="page-title">SYSTEM DASHBOARD</h1>
            <p className="page-subtitle">Interactive overview of active services, orders, and products</p>

            <div className="metrics-grid">
              <div className="glass-card metric-card">
                <span className="metric-label">Gross Revenue</span>
                <span className="metric-value">₹{totalRevenue.toFixed(0)}</span>
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-cosmic-gold" /> Gpay & Paytm Gateways
                </span>
              </div>
              <div className="glass-card metric-card">
                <span className="metric-label">Product Orders</span>
                <span className="metric-value">{orders.length}</span>
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" /> Completed checkouts
                </span>
              </div>
              <div className="glass-card metric-card">
                <span className="metric-label">Service Inquiries</span>
                <span className="metric-value">{serviceOrders.length}</span>
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <Inbox className="w-3 h-3 text-blue-400" />
                  {newServiceOrdersCount} new unread
                </span>
              </div>
              <div className="glass-card metric-card">
                <span className="metric-label">Catalog Products</span>
                <span className="metric-value">{products.length}</span>
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-400" /> Active listings
                </span>
              </div>
            </div>

            {/* Recent Service Orders preview */}
            <div className="glass-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="text-xl font-bold font-montserrat text-white">Recent Service Inquiries</h3>
                <button onClick={() => setCurrentTab('service-orders')} className="btn btn-secondary text-xs">View All</button>
              </div>
              {serviceOrders.length === 0 ? (
                <p className="text-white/40 text-center py-8">No service inquiries yet.</p>
              ) : (
                <div className="table-container">
                  <table className="cosmic-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {serviceOrders.slice(0, 5).map(o => (
                        <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedServiceOrder(o); setCurrentTab('service-orders'); }}>
                          <td className="font-mono text-xs text-cosmic-gold font-bold">{o.id}</td>
                          <td className="font-bold text-white">{o.name}</td>
                          <td><span className={`badge ${o.type === '3d-printing' ? 'badge-gold' : 'badge-blue'}`}>{o.type === '3d-printing' ? '3D Print' : 'Contact'}</span></td>
                          <td><span className={`badge ${svcStatusBadge(o.status)}`}>{o.status}</span></td>
                          <td className="text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Product Orders */}
            <div className="glass-card">
              <h3 className="text-xl font-bold font-montserrat text-white mb-6">Recent Product Orders</h3>
              {orders.length === 0 ? (
                <p className="text-white/40 text-center py-10">No orders in database.</p>
              ) : (
                <div className="table-container">
                  <table className="cosmic-table">
                    <thead><tr><th>Order ID</th><th>Client</th><th>Product</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {orders.slice(-5).reverse().map(order => (
                        <tr key={order.id}>
                          <td className="font-mono text-xs text-cosmic-gold font-bold">{order.id}</td>
                          <td>{order.billingAddress.name}</td>
                          <td>{order.productTitle}</td>
                          <td><span className={`badge ${order.option === 'customise' ? 'badge-gold' : 'badge-blue'}`}>{order.option === 'customise' ? 'Custom' : 'Standard'}</span></td>
                          <td className="font-mono">₹{order.price.toFixed(0)}</td>
                          <td><span className={`badge ${order.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>{order.status}</span></td>
                          <td><button onClick={() => setSelectedOrder(order)} className="btn btn-secondary text-[10px] px-3 py-1.5">Open</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ─────────────────────────────────────────────────────── */}
        {currentTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 className="page-title">PRODUCT CATALOG</h1>
              <button onClick={() => { setEditingProduct(null); setProductForm({ title: '', description: '', category: 'Websites', price: 0, thumbnail: '', purchase: true, customise: true }); setShowProductModal(true); }} className="btn btn-primary">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <p className="page-subtitle">Create and manage ready-made tech solutions</p>

            {isLoading ? (
              <p className="text-white/40 text-center py-20">Loading products...</p>
            ) : products.length === 0 ? (
              <div className="glass-card text-center py-16">
                <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Catalog Is Empty</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto mb-6">No active products. Add your first one above!</p>
              </div>
            ) : (
              <div className="glass-card">
                <div className="table-container">
                  <table className="cosmic-table">
                    <thead><tr><th>Thumbnail</th><th>Title</th><th>Category</th><th>Price</th><th>Options</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="w-12 h-12 rounded-lg bg-cosmic-black overflow-hidden border border-white/10">
                              <img src={product.thumbnail === '/placeholder.svg' ? `${API}/placeholder.svg` : product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="font-bold text-white">{product.title}</td>
                          <td><span className="badge badge-blue">{product.category}</span></td>
                          <td className="font-mono">₹{product.price.toFixed(0)}</td>
                          <td><div style={{ display: 'flex', gap: '4px' }}>{product.options.map(o => (<span key={o} className="badge badge-gold" style={{ fontSize: '9px' }}>{o}</span>))}</div></td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleEditProduct(product)} className="btn btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger text-xs px-3 py-1.5"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDER PIPELINES ───────────────────────────────────────────────── */}
        {currentTab === 'orders' && (
          <div>
            <h1 className="page-title">ORDER PIPELINES</h1>
            <p className="page-subtitle">Process incoming product purchases and customisation orders</p>

            {isLoading ? (
              <p className="text-white/40 text-center py-20">Syncing transaction data...</p>
            ) : orders.length === 0 ? (
              <div className="glass-card text-center py-16">
                <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Transactions</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto">No customer product orders recorded yet.</p>
              </div>
            ) : (
              <div className="glass-card">
                <div className="table-container">
                  <table className="cosmic-table">
                    <thead><tr><th>Order ID</th><th>Billing Name</th><th>Product</th><th>Type</th><th>Gateway</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="font-mono text-xs text-cosmic-gold font-bold">{order.id}</td>
                          <td>{order.billingAddress.name}</td>
                          <td>{order.productTitle}</td>
                          <td><span className={`badge ${order.option === 'customise' ? 'badge-gold' : 'badge-blue'}`}>{order.option === 'customise' ? 'Custom' : 'Standard'}</span></td>
                          <td className="font-mono font-bold">{order.paymentMethod}</td>
                          <td className="text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <select value={order.status} onChange={e => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="cosmic-input" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', display: 'inline-block' }}>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td><button onClick={() => setSelectedOrder(order)} className="btn btn-secondary text-xs px-3 py-1.5">Open</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SERVICE ORDERS ────────────────────────────────────────────────── */}
        {currentTab === 'service-orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 className="page-title">SERVICE ORDERS</h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {isRefreshing && <RefreshCw className="w-4 h-4 text-cosmic-gold animate-spin" />}
                <button onClick={() => fetchData(true)} className="btn btn-secondary text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            </div>
            <p className="page-subtitle">Contact forms and 3D printing orders — auto-refreshes every 15 seconds</p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {(['all', 'new', 'in-progress', 'completed'] as const).map(f => {
                const count = f === 'all' ? serviceOrders.length : serviceOrders.filter(o => o.status === f).length;
                return (
                  <button key={f} className={`badge ${f === 'new' ? 'badge-gold' : f === 'completed' ? 'badge-green' : 'badge-blue'}`}
                    style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => {}}>
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <p className="text-white/40 text-center py-20">Loading service orders...</p>
            ) : serviceOrders.length === 0 ? (
              <div className="glass-card text-center py-16">
                <Inbox className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Service Orders Yet</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto">When customers submit contact forms or 3D printing orders, they will appear here instantly.</p>
              </div>
            ) : (
              <div className="glass-card">
                <div className="table-container">
                  <table className="cosmic-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceOrders.map(order => (
                        <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedServiceOrder(order)}>
                          <td className="font-mono text-xs text-cosmic-gold font-bold">{order.id}</td>
                          <td>
                            <span className={`badge ${order.type === '3d-printing' ? 'badge-gold' : 'badge-blue'}`}>
                              {order.type === '3d-printing' ? '🖨 3D Print' : '✉ Contact'}
                            </span>
                          </td>
                          <td className="font-bold text-white">{order.name}</td>
                          <td className="text-xs text-white/60">{order.email}</td>
                          <td className="text-xs">{order.service || order.material || '—'}</td>
                          <td className="text-xs">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td onClick={e => e.stopPropagation()}>
                            <select value={order.status}
                              onChange={e => handleUpdateServiceOrderStatus(order.id, e.target.value as ServiceOrder['status'])}
                              className="cosmic-input" style={{ padding: '5px 10px', fontSize: '11px', width: 'auto', display: 'inline-block' }}>
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedServiceOrder(order)} className="btn btn-secondary text-[10px] px-3 py-1.5">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ─────────────────────────────────────────────────────── */}
        {currentTab === 'settings' && (
          <div>
            <h1 className="page-title">SERVICE SETTINGS</h1>
            <p className="page-subtitle">Configure options available to customers on service forms</p>

            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(156,166,183,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Printer className="w-5 h-5 text-cosmic-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-montserrat">3D Printing — Colour Options</h3>
                  <p className="text-white/40 text-xs">Manage which colour names are shown to customers per material type</p>
                </div>
              </div>

              {['PLA+', 'PETG', 'TPU'].map(material => (
                <div key={material} style={{ marginBottom: '24px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => setEditingMaterial(editingMaterial === material ? null : material)}
                    style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="font-black text-white uppercase tracking-widest" style={{ fontSize: '13px' }}>{material}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="text-white/40 text-xs">{(printColors[material] || []).length} colours</span>
                      <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${editingMaterial === material ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {editingMaterial === material && (
                    <div style={{ marginTop: '16px' }}>
                      {/* Existing colours */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        {(printColors[material] || []).map(color => (
                          <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '99px', background: 'rgba(156,166,183,0.12)', border: '1px solid rgba(156,166,183,0.3)' }}>
                            <span style={{ fontSize: '12px', color: '#9CA6B7', fontWeight: 700 }}>{color}</span>
                            <button onClick={() => handleRemoveColor(material, color)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', lineHeight: 1, padding: 0 }}>
                              <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                            </button>
                          </div>
                        ))}
                        {(printColors[material] || []).length === 0 && (
                          <span className="text-white/30 text-xs">No colours configured yet</span>
                        )}
                      </div>

                      {/* Add colour */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={newColorInput}
                          onChange={e => setNewColorInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(material); } }}
                          placeholder="e.g. Matte Black, Royal Blue..."
                          className="cosmic-input"
                          style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
                        />
                        <button onClick={() => handleAddColor(material)} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: ADD/EDIT PRODUCT ───────────────────────────────────────────── */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="text-2xl font-bold font-montserrat text-white">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="btn btn-secondary" style={{ padding: '8px' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input required type="text" value={productForm.title}
                  onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))}
                  className="cosmic-input" placeholder="Enter project name..." />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={productForm.category}
                  onChange={e => setProductForm(p => ({ ...p, category: e.target.value as Product['category'] }))}
                  className="cosmic-input">
                  <option value="Websites">Websites</option>
                  <option value="Robotic Projects">Robotic Projects</option>
                  <option value="IoT Projects">IoT Projects</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Base Price (₹)</label>
                <input required type="number" step="1" value={productForm.price}
                  onChange={e => setProductForm(p => ({ ...p, price: Number(e.target.value) }))}
                  className="cosmic-input" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea required value={productForm.description}
                  onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                  className="cosmic-input" placeholder="Enter specifications..." />
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexGrow: 1 }}>
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      style={{ display: uploadingFile ? 'none' : 'block' }} />
                    <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-white/[0.01] hover:border-cosmic-gold transition-colors">
                      <Upload className="w-4 h-4 text-cosmic-gold/50 inline-block mr-2" />
                      <span className="text-xs text-white/50">{uploadingFile ? 'Uploading...' : 'Upload Image'}</span>
                    </div>
                  </div>
                  {productForm.thumbnail && (
                    <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 bg-cosmic-black">
                      <img src={productForm.thumbnail} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Options</label>
                <div className="option-checkbox-group">
                  <label className="option-checkbox-label">
                    <input type="checkbox" checked={productForm.purchase}
                      onChange={e => setProductForm(p => ({ ...p, purchase: e.target.checked }))} className="option-checkbox" />
                    Purchase Project
                  </label>
                  <label className="option-checkbox-label">
                    <input type="checkbox" checked={productForm.customise}
                      onChange={e => setProductForm(p => ({ ...p, customise: e.target.checked }))} className="option-checkbox" />
                    Customise & Purchase
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary w-full">Cancel</button>
                <button type="submit" className="btn btn-primary w-full">Deploy Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PRODUCT ORDER DETAIL ───────────────────────────────────────── */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span className="text-[10px] font-black text-cosmic-gold uppercase tracking-widest font-mono block">Product Order</span>
                <h3 className="text-2xl font-bold font-montserrat text-white">{selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary" style={{ padding: '8px' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Status</span>
                  <span className="font-bold text-white uppercase">{selectedOrder.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['processing', 'shipped', 'completed'] as const).map(s => (
                    <button key={s} onClick={() => handleUpdateOrderStatus(selectedOrder.id, s)}
                      className={`btn text-[10px] px-3 py-2 ${selectedOrder.status === s ? 'btn-primary' : 'btn-secondary'}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="form-label" style={{ marginBottom: '8px' }}>Product</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <span className="font-bold text-white">{selectedOrder.productTitle}</span>
                    <span className="text-white/40 block text-xs font-mono">{selectedOrder.productId}</span>
                  </div>
                  <span className="font-mono text-cosmic-gold text-lg font-bold">₹{selectedOrder.price.toFixed(0)}</span>
                </div>
              </div>

              <div>
                <h4 className="form-label" style={{ marginBottom: '8px' }}>Billing Address</h4>
                <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', boxShadow: 'none' }}>
                  <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{selectedOrder.billingAddress.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedOrder.billingAddress.street}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} — {selectedOrder.billingAddress.pincode}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedOrder.billingAddress.country}</p>
                </div>
              </div>

              {selectedOrder.option === 'customise' && (
                <div>
                  <h4 className="form-label" style={{ marginBottom: '8px' }}>Customisation Details</h4>
                  <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(156,166,183,0.22)', boxShadow: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Email</span>
                        <span className="text-white font-bold text-xs">{selectedOrder.contact?.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Phone</span>
                        <span className="text-white font-bold text-xs">{selectedOrder.contact?.phone}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Scope</span>
                      <p className="text-white/80 text-xs italic">"{selectedOrder.customisation?.description}"</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Deadline</span>
                        <span className="text-cosmic-gold font-bold text-xs">{selectedOrder.customisation?.deadline}</span>
                      </div>
                      {selectedOrder.customisation?.fileUrl && (
                        <a href={selectedOrder.customisation.fileUrl} target="_blank" rel="noreferrer"
                          className="btn btn-secondary text-[10px] px-3 py-1.5 flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> View File
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Payment</span>
                  <span className="text-white font-bold">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Timestamp</span>
                  <span className="text-white font-bold text-xs font-mono">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="barcode-decor">||||||| | ||||| |||| | |||||||</div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary w-full" style={{ padding: '14px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SERVICE ORDER DETAIL ───────────────────────────────────────── */}
      {selectedServiceOrder && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span className={`badge ${selectedServiceOrder.type === '3d-printing' ? 'badge-gold' : 'badge-blue'} block mb-2`}>
                  {selectedServiceOrder.type === '3d-printing' ? '🖨 3D Printing Order' : '✉ Contact / Service Inquiry'}
                </span>
                <h3 className="text-2xl font-bold font-montserrat text-white">{selectedServiceOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedServiceOrder(null)} className="btn btn-secondary" style={{ padding: '8px' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Current Status</span>
                  <span className={`badge ${svcStatusBadge(selectedServiceOrder.status)}`}>{selectedServiceOrder.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['new', 'in-progress', 'completed', 'rejected'] as const).map(s => (
                    <button key={s} onClick={() => handleUpdateServiceOrderStatus(selectedServiceOrder.id, s)}
                      className={`btn text-[10px] px-3 py-2 ${selectedServiceOrder.status === s ? 'btn-primary' : 'btn-secondary'}`}>
                      {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h4 className="form-label" style={{ marginBottom: '12px' }}>Customer Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                    <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Name</span>
                    <span className="text-white font-bold">{selectedServiceOrder.name}</span>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                    <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Email</span>
                    <a href={`mailto:${selectedServiceOrder.email}`} className="text-cosmic-gold font-bold text-sm hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />{selectedServiceOrder.email}
                    </a>
                  </div>
                  {selectedServiceOrder.phone && (
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Phone</span>
                      <a href={`tel:${selectedServiceOrder.phone}`} className="text-white font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cosmic-gold" />{selectedServiceOrder.phone}
                      </a>
                    </div>
                  )}
                  {selectedServiceOrder.company && (
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Company</span>
                      <span className="text-white font-bold">{selectedServiceOrder.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3D Printing specifics */}
              {selectedServiceOrder.type === '3d-printing' && (
                <div>
                  <h4 className="form-label" style={{ marginBottom: '12px' }}>3D Print Specifications</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(156,166,183,0.08)', border: '1px solid rgba(156,166,183,0.22)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Material</span>
                      <span className="text-cosmic-gold font-black text-base">{selectedServiceOrder.material || '—'}</span>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(156,166,183,0.08)', border: '1px solid rgba(156,166,183,0.22)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Colour</span>
                      <span className="text-white font-bold">{selectedServiceOrder.color || '—'}</span>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(156,166,183,0.08)', border: '1px solid rgba(156,166,183,0.22)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Infill</span>
                      <span className="text-white font-black text-base">{selectedServiceOrder.infill !== undefined ? `${selectedServiceOrder.infill}%` : '—'}</span>
                    </div>
                  </div>
                  {selectedServiceOrder.modelFile && (
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', marginBottom: '12px' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-2">Uploaded Model</span>
                      <a href={selectedServiceOrder.modelFile} target="_blank" rel="noreferrer"
                        className="btn btn-secondary text-xs px-3 py-2 inline-flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" /> {selectedServiceOrder.modelFilename || 'Download File'}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Project details */}
              {(selectedServiceOrder.details || selectedServiceOrder.extraInfo) && (
                <div>
                  <h4 className="form-label" style={{ marginBottom: '12px' }}>Project Details</h4>
                  {selectedServiceOrder.details && (
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', marginBottom: '12px' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-2">Description</span>
                      <p className="text-white/80 text-sm" style={{ lineHeight: '1.6' }}>{selectedServiceOrder.details}</p>
                    </div>
                  )}
                  {selectedServiceOrder.extraInfo && (
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-2">Extra Notes</span>
                      <p className="text-white/80 text-sm">{selectedServiceOrder.extraInfo}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {selectedServiceOrder.service && (
                  <div>
                    <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Service</span>
                    <span className="text-white font-bold text-sm">{selectedServiceOrder.service}</span>
                  </div>
                )}
                {selectedServiceOrder.timeline && (
                  <div>
                    <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Timeline</span>
                    <span className="text-white font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-cosmic-gold" />{selectedServiceOrder.timeline}</span>
                  </div>
                )}
                {selectedServiceOrder.hearAbout && (
                  <div>
                    <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Heard via</span>
                    <span className="text-white font-bold text-sm">{selectedServiceOrder.hearAbout}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Received</span>
                  <span className="text-white font-bold text-xs font-mono">{new Date(selectedServiceOrder.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a href={`mailto:${selectedServiceOrder.email}`}
                  className="btn btn-primary text-xs flex-1 flex items-center justify-center gap-2" style={{ padding: '12px' }}>
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                {selectedServiceOrder.phone && (
                  <a href={`tel:${selectedServiceOrder.phone}`}
                    className="btn btn-secondary text-xs flex items-center gap-2" style={{ padding: '12px 16px' }}>
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
                <button onClick={() => setSelectedServiceOrder(null)} className="btn btn-secondary text-xs" style={{ padding: '12px 16px' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
