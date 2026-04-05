import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, notes, setNotes } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center space-y-6">
          <div className="text-gray-200">
            <Trash2 size={80} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">سلة التسوق فارغة</h2>
          <p className="text-gray-500">ابدأ بإضافة بعض الأصناف اللذيذة إلى سلتك!</p>
          <Link
            to="/menu"
            className="inline-block bg-primary text-secondary font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors"
          >
            العودة للمنيو
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 bg-white shadow-sm p-4 flex items-center justify-between">
        <Link to="/menu" className="p-2 text-secondary hover:bg-gray-100 rounded-full transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-xl font-bold text-secondary">سلة الطلبات</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {cart.map((item) => (
          <motion.div
            layout
            key={item._id}
            className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
              <img 
                src={item.image || 'https://via.placeholder.com/150'} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-bold text-secondary">{item.name}</h3>
              <p className="text-sm text-primary font-bold">{item.price} ر.س</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  className="p-1 text-primary hover:bg-white rounded-md transition-colors"
                >
                  <Plus size={18} />
                </button>
                <span className="w-8 text-center font-bold text-secondary">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  className="p-1 text-secondary hover:bg-white rounded-md transition-colors"
                >
                  <Minus size={18} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Order Notes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3 mt-6">
          <label className="flex items-center gap-2 text-secondary font-bold">
            <MessageSquare size={18} className="text-primary" /> ملاحظات الطلب
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
            placeholder="مثال: بدون بصل، زيادة صوص..."
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">المجموع الفرعي</span>
            <span className="font-bold text-secondary">{totalPrice} ر.س</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xl">
            <span className="font-bold text-secondary">الإجمالي النهائي</span>
            <span className="font-bold text-primary">{totalPrice} ر.س</span>
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/confirmation')}
            className="w-full bg-primary text-secondary font-bold py-4 rounded-2xl shadow-lg hover:bg-yellow-500 transition-colors active:scale-95 transform text-lg"
          >
            تأكيد الطلب
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
