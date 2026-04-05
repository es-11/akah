import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Phone, User, Car, Search } from 'lucide-react';

const WelcomePage = () => {
  const [formData, setFormData] = useState({
    phone: '+966',
    name: '',
    carName: '',
    carType: '',
    plateNumber: '',
  });
  const [error, setError] = useState('');
  const [lastOrderId, setLastOrderId] = useState(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrderId = localStorage.getItem('lastOrderId');
    if (savedOrderId) {
      setLastOrderId(savedOrderId);
    }
  }, []);

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+966')) {
      val = '+966';
    }
    // Only allow digits after +966
    const digits = val.slice(4).replace(/\D/g, '');
    if (digits.length <= 9) {
      setFormData({ ...formData, phone: '+966' + digits });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const digits = formData.phone.slice(4);
    if (digits.length !== 9) {
      setError('يرجى إدخال رقم جوال صحيح (9 أرقام بعد +966)');
      return;
    }
    
    setUser({
      phone: formData.phone,
      name: formData.name,
      car: {
        name: formData.carName,
        type: formData.carType,
        plate: formData.plateNumber,
      }
    });
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-primary p-8 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-2">عكة برجر</h1>
          <p className="text-secondary opacity-90">Burger | Noodles</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-secondary">مرحباً بك في عكة برجر</h2>
            <p className="text-gray-600 text-sm">اطلب مسبقاً واستلم طلبك بسهولة</p>
          </div>

          <div className="space-y-4">
            {/* Phone Number - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={16} /> رقم الجوال (مطلوب)
              </label>
              <input
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-right"
                placeholder="+966XXXXXXXXX"
                required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Name - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User size={16} /> الاسم (اختياري)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="أدخل اسمك"
              />
            </div>

            {/* Car Info - Optional */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-secondary mb-3 flex items-center gap-2">
                <Car size={18} /> معلومات السيارة (اختياري)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.carName}
                  onChange={(e) => setFormData({ ...formData, carName: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="ماركة السيارة"
                />
                <input
                  type="text"
                  value={formData.carType}
                  onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="نوع السيارة"
                />
              </div>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="w-full mt-3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="رقم اللوحة"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-secondary font-bold py-4 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors active:scale-95 transform"
          >
            ابدأ الطلب
          </button>

          {lastOrderId && (
            <button
              type="button"
              onClick={() => navigate(`/track-order/${lastOrderId}`)}
              className="w-full mt-4 bg-secondary text-primary font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors active:scale-95 transform border border-primary/20"
            >
              <Search size={18} />
              متابعة طلبي الحالي
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
