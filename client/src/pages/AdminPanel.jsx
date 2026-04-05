import { useState, useEffect } from 'react';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Layout, DollarSign, FileText } from 'lucide-react';

const categories = [
  "Beef Burgers",
  "Chicken Burgers",
  "Sandwiches",
  "Indomie",
  "Fries",
  "Kids Meals",
  "Drinks"
];

const AdminPanel = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: categories[0],
    image: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/api/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/api/menu/${editingItem._id}`, editingItem);
        setEditingItem(null);
      } else {
        await api.post('/api/menu', newItem);
        setNewItem({
          name: '',
          description: '',
          price: '',
          category: categories[0],
          image: '',
        });
        setShowForm(false);
      }
      fetchMenu();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      try {
        await api.delete(`/api/menu/${id}`);
        fetchMenu();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-cairo" dir="rtl">
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة المنيو</h1>
          <p className="text-gray-500 font-bold">إضافة وتعديل وحذف أصناف القائمة</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingItem(null); }}
          className="bg-primary text-secondary font-black px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'إغلاق' : 'صنف جديد'}
        </button>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Add/Edit Form */}
        <AnimatePresence>
          {(showForm || editingItem) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-3xl shadow-xl border-2 border-primary/20 mb-10 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
              <h2 className="text-2xl font-black text-secondary mb-8 flex items-center gap-3">
                {editingItem ? <Edit2 size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />}
                {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <Layout size={16} className="text-primary" /> اسم الصنف
                    </label>
                    <input
                      type="text"
                      value={editingItem ? editingItem.name : newItem.name}
                      onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                      placeholder="مثال: دبل تشيز برجر"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-primary" /> الوصف
                    </label>
                    <textarea
                      value={editingItem ? editingItem.description : newItem.description}
                      onChange={(e) => editingItem ? setEditingItem({ ...editingItem, description: e.target.value }) : setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none font-bold min-h-[120px]"
                      placeholder="وصف الصنف والمكونات..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={16} className="text-primary" /> السعر (ر.س)
                      </label>
                      <input
                        type="number"
                        value={editingItem ? editingItem.price : newItem.price}
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, price: e.target.value }) : setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                        <Layout size={16} className="text-primary" /> القسم
                      </label>
                      <select
                        value={editingItem ? editingItem.category : newItem.category}
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, category: e.target.value }) : setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none font-bold appearance-none"
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon size={16} className="text-primary" /> رابط الصورة
                    </label>
                    <input
                      type="text"
                      value={editingItem ? editingItem.image : newItem.image}
                      onChange={(e) => editingItem ? setEditingItem({ ...editingItem, image: e.target.value }) : setNewItem({ ...newItem, image: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-accent text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                      <Save size={20} /> حفظ الصنف
                    </button>
                    {editingItem && (
                      <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-200 text-gray-600 font-black px-8 py-4 rounded-2xl hover:bg-gray-300 transition-all">
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 bg-gray-100">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-primary text-secondary font-black px-4 py-1.5 rounded-full text-xs shadow-lg">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-secondary">{item.name}</h3>
                  <span className="text-lg font-black text-primary">{item.price} ر.س</span>
                </div>
                <p className="text-gray-500 text-sm font-bold line-clamp-2">{item.description}</p>
              </div>
              <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex gap-2">
                <button
                  onClick={() => { setEditingItem(item); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-black py-3 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={16} /> تعديل
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-black py-3 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
