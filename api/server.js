
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database');
const seedUsers = require('./seeds/users');
const port = process.env.PORT || 3000;



connectDB().then(conn => {
    console.info('MongoDB connected...');
    if (
        process.argv.includes('db:seed') // app runs without docker by: `npm run start db:seed`
        || process.env.DB_SEED === 'true' // app runs with docker by: `DB_SEED=true docker-compose up -d`
    ) {
        seedUsers().then(() => console.info('Users seeded.'));
    }
});

const app = express();

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI || 'mongodb://mongo:27017/men_assessment',
            // mongoOptions: {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            // },
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

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

app.listen(port, () => console.info(`API server listening on port ${port}...`));



// Exporting the app for testing
module.exports = app;
