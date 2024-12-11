
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const seedUsers = require('./seeds/users');
const port = process.env.PORT || 3000;



connectDB().then(conn => {
    console.log('MongoDB connected...');
    if (
        process.argv.includes('db:seed') // app runs without docker by: `npm run start db:seed`
        || process.env.DB_SEED === 'true' // app runs with docker by: `DB_SEED=true docker-compose up -d`
    ) {
        seedUsers().then(() => console.log('Users seeded.'));
    }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// URL-endpoints
app.get('/api', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Root URL'
    });
});
app.use('/api/users', require('./routes/users'));
app.use('/api/links', require('./routes/links'));
app.use('/api/admin', require('./routes/admin'));



// Handling errors for 404 not-founds
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "URL-endpoint not found!"
    });
});

// Handling errors for any other cases from whole application
app.use((err, req, res) => {
    return res.status(500).json({
        success: false,
        message: "Something went wrong!"
    });
});

app.listen(port, () => console.log(`API server listening on port ${port}...`));



// Exporting the app for testing
module.exports = app;
