const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./config/db');
const Student = require('./models/Student');
const { seedDatabase } = require('./services/demoDataSeeder');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
async function startServer() {
  const conn = await connectDB();

  // If connected and empty, auto-seed with 10 sample students
  if (conn) {
    try {
      const studentCount = await Student.countDocuments();
      if (studentCount === 0) {
        console.log('[Bootstrap] No students found in database. Auto-seeding initial demo cohort...');
        await seedDatabase();
      }
    } catch (e) {
      console.warn('[Bootstrap] Initial check skipped:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` 🚀 Multimodal Attendance & Engagement Agent Backend `);
    console.log(` 🌐 Server listening on http://localhost:${PORT}        `);
    console.log(` 📡 Health check at http://localhost:${PORT}/api/health `);
    console.log(`====================================================`);
  });
}

startServer();
