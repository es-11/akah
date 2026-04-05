import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, User, Car, MessageSquare, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { api } from '../api';

const ConfirmationPage = () => {
  const { cart, totalPrice, notes, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const orderData = {
        phone: user.phone,
        name: user.name,
        car: user.car,
        items: cart.map(item => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        notes,
        totalPrice,
      };

      await api.post('/api/orders', orderData);
      clearCart();
      alert('تم إرسال طلبك بنجاح! جاري التجهيز...');
      navigate('/');
    } catch (err) {
      console.error('Error sending order:', err);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <h2 className="text-2xl font-bold text-secondary">لا توجد بيانات للطلب</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-primary px-6 py-2 rounded-xl font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="p-8 text-center bg-white shadow-sm">
        <div className="inline-block p-3 bg-accent/10 text-accent rounded-full mb-4">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-2xl font-bold text-secondary">تأكيد الطلب</h1>
        <p className="text-gray-500">يرجى مراجعة تفاصيل طلبك قبل الإرسال</p>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Customer Information Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2 border-b border-gray-100 pb-3">
            <User size={20} className="text-primary" /> بيانات العميل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">رقم الجوال</p>
                <p className="font-bold text-secondary">{user.phone}</p>
              </div>
            </div>
            {user.name && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">الاسم</p>
                  <p className="font-bold text-secondary">{user.name}</p>
                </div>
              </div>
            )}
            {user.car.name && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl col-span-full">
                <Car size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">معلومات السيارة</p>
                  <p className="font-bold text-secondary">
                    {user.car.name} - {user.car.type} ({user.car.plate})
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Order Details Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShoppingBag size={20} className="text-primary" /> تفاصيل الطلب
          </h2>
          <div className="divide-y divide-gray-50">
            {cart.map((item) => (
              <div key={item._id} className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-secondary">{item.name}</h3>
                  <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                </div>
                <p className="font-bold text-primary">{item.price * item.quantity} ر.س</p>
              </div>
            ))}
          </div>

          {notes && (
            <div className="p-4 bg-yellow-50 rounded-xl mt-4">
              <p className="text-sm font-bold text-secondary flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-primary" /> ملاحظاتك:
              </p>
              <p className="text-sm text-gray-700">{notes}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xl">
            <span className="font-bold text-secondary">الإجمالي النهائي</span>
            <span className="font-bold text-primary">{totalPrice} ر.س</span>
          </div>
        </section>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSendOrder}
            disabled={isSubmitting}
            className={`w-full bg-accent text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 transform text-lg flex items-center justify-center gap-3 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Send size={20} />
                إرسال الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
