
require('colors');
const mongoose = require('mongoose');
let conn;

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/men_assessment';
    console.info(`Please wait while connecting to MongoDB...`.cyan.underline.bold);

    try {
        conn = await mongoose.connect(mongoUri);

        console.info(`MongoDB host: ${conn.connection.host}`.green.bold);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const closeDB = async (dropDatabase = false) => {
    if (!conn) return;
    try {
        if (dropDatabase) {
            await mongoose.connection.dropDatabase();
            console.info(`Dropped MongoDB database.`.red.bold);
        }
        await mongoose.connection.close(); // await mongoose.disconnect();
        console.info(`Closed MongoDB connection.`.yellow.bold);
    } catch (err) {
        console.error('Error closing MongoDB connection!', err);
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
