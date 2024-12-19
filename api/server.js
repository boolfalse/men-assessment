
require('dotenv').config();
const { connectDB } = require('./config/database');
const seedUsers = require('./seeds/users');
const apiApp = require('./app');
const port = process.env.PORT || 3000;



connectDB().then(() => {
    if (
        process.argv.includes('db:seed') // app runs without docker by: `npm run start db:seed`
        || process.env.DB_SEED === 'true' // app runs with docker by: `DB_SEED=true docker-compose up -d`
    ) {
        seedUsers().then(() => console.info(`Users seeded.`.green.bold));
    }
});

const app = apiApp;

app.listen(port, () => console.info(`API server listening on port ${port}.`.green.bold));



// Exporting the app for Unit testing
module.exports = app;
