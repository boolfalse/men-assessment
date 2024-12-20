
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');



const app = express();

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new session.MemoryStore(), // alternative to `MongoStore`
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



module.exports = app;
