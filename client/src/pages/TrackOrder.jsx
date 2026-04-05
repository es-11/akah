import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Loader2, Home, Phone, MapPin, Package } from 'lucide-react';
import { supabase } from '../supabaseClient';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, created_at, total_price, name, order_items(name, quantity)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Real-time subscription for order status updates
    const channel = supabase
      .channel(`order-tracking-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        (payload) => {
          setOrder(prev => ({ ...prev, status: payload.new.status }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          title: 'تم استلام طلبك',
          description: 'نحن نراجع طلبك الآن وسنباشر التحضير فوراً.',
          icon: <Clock size={48} className="text-yellow-500" />,
          step: 1
        };
      case 'preparing':
        return {
          title: 'جاري التحضير',
          description: 'شيف عكة برجر يقوم بتجهيز وجبتك بكل حب.',
          icon: <Loader2 size={48} className="text-primary animate-spin" />,
          step: 2
        };
      case 'ready':
        return {
          title: 'طلبك جاهز!',
          description: 'تفضل باستلام طلبك من الفرع، بالعافية عليك.',
          icon: <CheckCircle2 size={48} className="text-accent" />,
          step: 3
        };
      case 'completed':
        return {
          title: 'تم التسليم',
          description: 'نتمنى أن تكون قد استمتعت بوجبتك من عكة برجر.',
          icon: <Package size={48} className="text-gray-500" />,
          step: 4
        };
      default:
        return {
          title: 'حالة غير معروفة',
          description: 'يرجى التواصل مع الفرع للتأكد من حالة طلبك.',
          icon: <Clock size={48} className="text-gray-400" />,
          step: 0
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="mt-4 text-secondary font-bold">جاري تحميل حالة الطلب...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-center">
        <h2 className="text-2xl font-bold text-secondary">عذراً، لم يتم العثور على الطلب</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-secondary px-8 py-3 rounded-2xl font-bold shadow-lg"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-cairo" dir="rtl">
      {/* Header */}
      <header className="bg-white p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-secondary">متابعة الطلب</h1>
          <button onClick={() => navigate('/')} className="p-2 bg-gray-100 rounded-full text-gray-600">
            <Home size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 border-2 border-primary/10"
        >
          <div className="flex justify-center mb-2">
            {statusInfo.icon}
          </div>
          <h2 className="text-3xl font-black text-secondary">{statusInfo.title}</h2>
          <p className="text-gray-500 font-bold">{statusInfo.description}</p>
          
          {/* Progress Bar */}
          <div className="flex justify-between items-center mt-10 relative px-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 right-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
              style={{ width: `${((statusInfo.step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`w-4 h-4 rounded-full z-10 transition-colors duration-500 ${
                  s <= statusInfo.step ? 'bg-primary' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-black text-gray-400 mt-2">
            <span>تم الاستلام</span>
            <span>التحضير</span>
            <span>جاهز</span>
            <span>تم التسليم</span>
          </div>
        </motion.div>

        {/* Order Details */}
        <section className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-black text-secondary flex items-center gap-2">
              <Package size={20} className="text-primary" /> تفاصيل الطلب
            </h3>
            <span className="text-xs font-bold text-gray-400">#{order.id.slice(0, 8)}</span>
          </div>
          <div className="p-6 space-y-4">
            {order.order_items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="font-bold text-secondary">
                  <span className="text-primary">{item.quantity}x</span> {item.name}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
              <span className="font-black text-secondary text-lg">الإجمالي</span>
              <span className="font-black text-primary text-xl">{order.total_price} ر.س</span>
            </div>
          </div>
        </section>

        {/* Help / Contact */}
        <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
          <h3 className="font-black text-secondary text-center">هل تحتاج للمساعدة؟</h3>
          <div className="flex gap-4">
            <a 
              href="tel:0500000000" 
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 border border-gray-100"
            >
              <Phone size={24} className="text-primary" />
              <span className="text-xs font-bold text-secondary">اتصل بنا</span>
            </a>
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 border border-gray-100">
              <MapPin size={24} className="text-primary" />
              <span className="text-xs font-bold text-secondary">موقع الفرع</span>
            </div>
          </div>
        </section>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 text-gray-500 font-bold hover:text-secondary transition-colors"
        >
          العودة للرئيسية
        </button>
      </main>
    </div>
  );
};

export default TrackOrder;
