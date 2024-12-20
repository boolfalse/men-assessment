
const supertest = require('supertest');
const { beforeAll, afterAll, describe, expect, it } = require('@jest/globals');
const { connectDB, closeDB } = require('../api/config/database');
const seedUsers = require('../api/seeds/users');
const app = require('../api/app');
const request = supertest(app);

const timeoutMs = 12 * 1000;
const randomString = Math.random().toString(36).substring(7);
const referrerUser = {
    id: '',
    isAdmin: false,
    name: 'John Doe',
    email: `${randomString}@example.com`,
    password: 'password',
    token: '',
};
const testLink = {
    referral_key: '',
};

describe('Integration tests', () => {

    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI; // will be set in `docker-compose.yml`
        connectDB(mongoUri).then(() => {
            if (
                process.argv.includes('db:seed') // app runs without docker by: `npm run start db:seed`
                || process.env.DB_SEED === 'true' // app runs with docker by: `DB_SEED=true docker-compose up -d`
            ) {
                seedUsers().then(() => console.info(`Users seeded.`.green.bold));
            }
        });
    });

    // API root URL endpoint
    it('GET /api', async () => {
        const response = await request.get('/api');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Root URL');
    });

    // Not found URL endpoint
    it('GET /api/<NON-EXISTING-ENDPOINT>', async () => {
        const randomUri = Math.random().toString(36).substring(7);
        const response = await request.get(`/api/${randomUri}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('URL-endpoint not found!');
    });

    // Register a new user
    it('POST /api/auth/register', async () => {
        const response = await request.post('/api/users/register').send({
            name: referrerUser.name,
            email: referrerUser.email,
            password: referrerUser.password,
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // User created successfully.
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe(referrerUser.name);
        expect(response.body.data.email).toBe(referrerUser.email);

        referrerUser.id = response.body.data.id;
    }, timeoutMs);

    // Login a user
    it('POST /api/auth/login', async () => {
        const response = await request.post('/api/users/login').send({
            email: referrerUser.email,
            password: referrerUser.password,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // User logged in successfully.
        expect(response.body.data).toBeDefined();
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe(referrerUser.name);
        expect(response.body.data.email).toBe(referrerUser.email);

        referrerUser.token = response.body.data.token;
    });

    // Get user profile
    it('GET /api/users/profile', async () => {
        const response = await request.get('/api/users/profile')
            .set('Authorization', `Bearer ${referrerUser.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // User profile retrieved successfully.
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe(referrerUser.name);
        expect(response.body.data.email).toBe(referrerUser.email);
        expect(response.body.data.isAdmin).toBe(referrerUser.isAdmin);
    });

    // Get all links
    it('GET /api/links', async () => {
        const response = await request.get('/api/links')
            .set('Authorization', `Bearer ${referrerUser.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // Links retrieved successfully.
        expect(response.body.data).toBeDefined();
    });

    // Create a new link
    it('POST /api/links', async () => {
        const response = await request.post('/api/links')
            .set('Authorization', `Bearer ${referrerUser.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // Link created successfully.
        expect(response.body.data).toBeDefined();
        expect(response.body.data.referral_key).toBeDefined();
        expect(response.body.data.referral_endpoint).toBeDefined();

        testLink.referral_key = response.body.data.referral_key;
    });

    // Get referral link
    it('GET /api/links/:referral_key', async () => {
        const response = await request.get(`/api/links/${testLink.referral_key}`)
            .set('Authorization', `Bearer ${referrerUser.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined(); // Referral information retrieved successfully.
        expect(response.body.data).toBeDefined();
        expect(response.body.data.used).toBeDefined();
    });

    afterAll(async () => {
        await closeDB(true); // argument `true` drops the database before closing the connection
    });

});
