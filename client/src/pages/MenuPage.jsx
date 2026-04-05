import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const categories = [
  "Beef Burgers",
  "Chicken Burgers",
  "Sandwiches",
  "Indomie",
  "Fries",
  "Kids Meals",
  "Drinks"
];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('id,name,description,price,category,image')
          .order('category', { ascending: true })
          .order('name', { ascending: true });
        if (error) throw error;
        const normalized = (data || []).map((row) => ({
          _id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          image: row.image,
        }));
        setMenuItems(normalized);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">عكة برجر</h1>
          <Link to="/cart" className="relative p-2 bg-primary rounded-full text-secondary shadow-lg">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
        
        {/* Categories Scroller */}
        <div className="flex gap-3 overflow-x-auto py-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-bold transition-all ${
                selectedCategory === cat 
                ? 'bg-secondary text-primary shadow-md scale-105' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Menu Items Grid */}
      <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-row-reverse"
            >
              <div className="w-1/3 aspect-square bg-gray-100 overflow-hidden">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-secondary">{item.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-primary">{item.price} ر.س</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-accent text-white p-2 rounded-lg shadow hover:bg-green-600 transition-colors active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد أصناف في هذا القسم حالياً
          </div>
        )}
      </main>

      {/* Floating Cart Button for Mobile */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:hidden"
        >
          <Link
            to="/cart"
            className="w-full bg-secondary text-primary flex justify-between items-center px-8 py-4 rounded-2xl shadow-2xl font-bold"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} />
              <span>عرض السلة ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
            </div>
            <span>{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)} ر.س</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
