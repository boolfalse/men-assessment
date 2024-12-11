
require('colors');
const mongoose = require('mongoose');
let conn;

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/men_assessment';
    console.log(`Please wait while connecting to MongoDB...`.cyan.underline.bold);

    try {
        conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB host: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const closeDB = async () => {
    if (!conn) return;
    try {
        await mongoose.connection.close();
        console.log('Closed MongoDB connection!');
    } catch (err) {
        console.error('Error closing MongoDB connection', err);
    }
};

// Ensure connection closes on app exit or test crash
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

module.exports = {
    connectDB,
    closeDB,
};
