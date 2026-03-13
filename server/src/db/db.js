const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Mask the password for logging
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`🔌 Attempting connection: ${maskedUri}`);
    console.log(`📏 URI Length: ${uri.length} characters`);

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error!`);
    console.error(`   Message: ${error.message}`);
    if (error.code) console.error(`   Code: ${error.code}`);
    process.exit(1);
  }
};

module.exports = connectDB;
