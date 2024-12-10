
const mongoose = require('mongoose');
let conn;

const connectDB = async () => {
    try {
        conn = await mongoose.connect(process.env.MONGO_URI);

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
