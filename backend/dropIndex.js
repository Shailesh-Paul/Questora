const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });


const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const User = mongoose.model('User', new mongoose.Schema({})); // Minimal schema
    await User.collection.dropIndex('phone_number_1');
    console.log('Index phone_number_1 dropped successfully');

    
    process.exit();
  } catch (error) {
    if (error.codeName === 'IndexNotFound') {
      console.log('Index already dropped or not found');
    } else {
      console.error('Failed to drop index:', error);
    }
    process.exit();
  }
};

dropIndex();
