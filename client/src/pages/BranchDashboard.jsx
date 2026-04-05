import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Loader2, Phone, User, Car, Package, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const BranchDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('live'); // 'live' or 'history'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let query = supabase
          .from('orders')
          .select('id,phone,name,car_name,car_type,car_plate,notes,total_price,status,created_at,order_items(id,item_id,name,price,quantity)');
        
        if (view === 'live') {
          query = query.neq('status', 'completed');
        } else {
          query = query.eq('status', 'completed');
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        const normalized = (data || []).map((row) => ({
          _id: row.id,
          phone: row.phone,
          name: row.name,
          car: {
            name: row.car_name,
            type: row.car_type,
            plate: row.car_plate,
          },
          items: (row.order_items || []).map((it) => ({
            itemId: it.item_id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
          })),
          notes: row.notes,
          totalPrice: row.total_price,
          status: row.status,
          createdAt: row.created_at,
        }));
        setOrders(normalized);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          if (payload.eventType === 'INSERT' && view === 'live') {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {});
          }
          await fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [view]);

  const updateStatus = async (id, status) => {
    try {
      const adminToken = import.meta.env.VITE_ADMIN_TOKEN || '';
      if (!adminToken) {
        alert('لا يوجد رمز إدارة (ADMIN TOKEN) مضبوط');
        return;
      }
      const res = await fetch('/.netlify/functions/order-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-secondary">شاشة المطبخ / الفرع</h1>
          <p className="text-gray-500">متابعة الطلبات المباشرة - عكة برجر</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => setView('live')}
            className={`px-6 py-2.5 rounded-lg font-black transition-all ${
              view === 'live' ? 'bg-primary text-secondary shadow-md' : 'text-gray-500 hover:text-secondary'
            }`}
          >
            الطلبات الحالية
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-2.5 rounded-lg font-black transition-all ${
              view === 'history' ? 'bg-primary text-secondary shadow-md' : 'text-gray-500 hover:text-secondary'
            }`}
          >
            سجل الطلبات
          </button>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-xl border border-primary/20">
          <Clock size={24} className="text-primary" />
          <span className="font-bold text-secondary">{new Date().toLocaleDateString('ar-SA')}</span>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-primary" />
          <p className="mt-4 text-gray-500 font-bold text-lg">جاري تحميل الطلبات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={order._id}
                className={`bg-white rounded-3xl shadow-md overflow-hidden border-2 ${
                  order.status === 'pending' ? 'border-primary animate-pulse-slow' : 'border-transparent'
                }`}
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary text-primary w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl shadow-inner">
                      {orders.length - index}
                    </span>
                    <span className="text-sm font-bold text-gray-500">{formatTime(order.createdAt)}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)} shadow-sm`}>
                    {order.status === 'pending' ? 'جديد' : order.status === 'preparing' ? 'جاري التحضير' : 'جاهز للاستلام'}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="p-5 space-y-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><Phone size={18} /></div>
                    <span className="font-black text-secondary tracking-widest">{order.phone}</span>
                  </div>
                  {order.name && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary"><User size={18} /></div>
                      <span className="font-bold text-gray-700">{order.name}</span>
                    </div>
                  )}
                  {order.car?.name && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                      <Car size={18} className="text-primary" />
                      <div className="text-sm">
                        <p className="font-black text-secondary">{order.car.name} - {order.car.type}</p>
                        <p className="text-gray-600 font-bold">{order.car.plate}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="p-5 border-t border-dashed border-gray-200 bg-gray-50/30">
                  <p className="text-xs font-black text-gray-400 mb-3 flex items-center gap-2">
                    <Package size={14} /> تفاصيل الطلب:
                  </p>
                  <ul className="space-y-2">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-start">
                        <span className="font-black text-secondary text-lg">
                          <span className="text-primary ml-2">{item.quantity}x</span> {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {order.notes && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-xs font-black text-red-800 mb-1">ملاحظة العميل:</p>
                      <p className="text-sm font-bold text-red-900 leading-relaxed">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-5 bg-white flex gap-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="flex-1 bg-primary text-secondary font-black py-4 rounded-2xl shadow-lg hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Loader2 size={18} className="animate-spin-slow" /> جاري التحضير
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateStatus(order._id, 'ready')}
                      className="flex-1 bg-accent text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 size={18} /> تم التجهيز
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateStatus(order._id, 'completed')}
                      className="flex-1 bg-accent text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 size={18} /> تم التسليم
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(0.99); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BranchDashboard;
