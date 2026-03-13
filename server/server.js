require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 QuietInk server running on http://localhost:${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   POST   http://localhost:${PORT}/api/journals`);
    console.log(`   GET    http://localhost:${PORT}/api/journals`);
    console.log(`   PUT    http://localhost:${PORT}/api/journals/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/journals/:id`);
  });
};

startServer();
