const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/akah_burger';

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
});

const MenuItemModel = mongoose.model('MenuItem', menuItemSchema);

const menuData = [
  {
    name: "برجر سنقل لحم (Single Beef Burger)",
    description: "شريحة لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.",
    price: 10,
    category: "Beef Burgers"
  },
  {
    name: "برجر دبل لحم (Double Beef Burger)",
    description: "شريحتين لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.",
    price: 15,
    category: "Beef Burgers"
  },
  {
    name: "برجر تربل لحم (Triple Beef Burger)",
    description: "ثلاث شرائح لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.",
    price: 20,
    category: "Beef Burgers"
  },
  {
    name: "مقلوب سنقل لحم (Upside-Down Single Beef Burger)",
    description: "شريحة لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.",
    price: 15,
    category: "Beef Burgers"
  },
  {
    name: "مقلوب دبل لحم (Upside-Down Double Beef Burger)",
    description: "شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.",
    price: 17,
    category: "Beef Burgers"
  },
  {
    name: "فلات بيف برجر (Flat Beef Burger)",
    description: "شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص.",
    price: 17,
    category: "Beef Burgers"
  },
  {
    name: "برجر مكس لحم ودجاج (Beef & Chicken Mix Burger)",
    description: "شريحة لحم بقري مع دجاج وجبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.",
    price: 15,
    category: "Beef Burgers"
  },
  {
    name: "برجر سنقل دجاج مشوي (Single Grilled Chicken Burger)",
    description: "صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.",
    price: 13,
    category: "Chicken Burgers"
  },
  {
    name: "برجر دبل دجاج مشوي (Double Grilled Chicken Burger)",
    description: "قطعتين صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.",
    price: 15,
    category: "Chicken Burgers"
  },
  {
    name: "برجر سنقل دجاج كرسبي (Crispy Fried Chicken Burger)",
    description: "صدر دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.",
    price: 13,
    category: "Chicken Burgers"
  },
  {
    name: "برجر دبل دجاج كرسبي (Crispy Double Fried Chicken Burger)",
    description: "قطعتين دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.",
    price: 15,
    category: "Chicken Burgers"
  },
  {
    name: "كلوب دجاج ساندويتش (Club Chicken Sandwich)",
    description: "ساندويتش من خبز التوست المحمص مع دجاج كرسبي وخس وصوص ويقدم مع بطاطس.",
    price: 13,
    category: "Sandwiches"
  },
  {
    name: "كلوب لحم ساندويتش (Club Beef Sandwich)",
    description: "ساندويتش من خبز التوست المحمص مع اللحم وصوص خاص ويقدم مع بطاطس.",
    price: 13,
    category: "Sandwiches"
  },
  {
    name: "إندومي دجاج بالكريمة",
    description: "خليط من الإندومي مع نكهة الكريمة والدجاج والخضار.",
    price: 10,
    category: "Indomie"
  },
  {
    name: "إندومي دجاج صويا",
    description: "خليط من الإندومي مع نكهة الصويا.",
    price: 10,
    category: "Indomie"
  },
  {
    name: "إندومي شيتوس",
    description: "خليط من الإندومي مع شيبس الشيتوس الحار.",
    price: 10,
    category: "Indomie"
  },
  {
    name: "إندومي دجاج سبايسي",
    description: "خليط من الإندومي مع نكهة الكريمة والدجاج والخضار الحارة.",
    price: 10,
    category: "Indomie"
  },
  {
    name: "بطاطس مقلية",
    description: "بطاطس بلجيكية مقلية مقرمشة.",
    price: 3,
    category: "Fries"
  },
  {
    name: "تشيكن فرايز",
    description: "بطاطس مقلية مع قطع دجاج مقرمش مع مزيج من الصوصات.",
    price: 10,
    category: "Fries"
  },
  {
    name: "مكعبات بطاطس",
    description: "مكعبات بطاطس بلجيكية مقلية مقرمشة مع الصوصات.",
    price: 10,
    category: "Fries"
  },
  {
    name: "كلوب تشيكن ساندويتش (وجبة أطفال)",
    description: "ساندويتش توست مع دجاج كرسبي وخس وصوص مع بطاطس ومشروب أطفال.",
    price: 14,
    category: "Kids Meals"
  },
  {
    name: "تشيكن ناجيت",
    description: "قطع دجاج ناجيت مع بطاطس ومشروب أطفال.",
    price: 10,
    category: "Kids Meals"
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');
    await MenuItemModel.deleteMany({});
    console.log('Cleared existing menu items.');
    await MenuItemModel.insertMany(menuData);
    console.log('Successfully seeded menu items!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
