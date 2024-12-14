
const request = require('supertest');
const express = require('express');
const User = require('../api/models/user');
const Link = require('../api/models/link');
const Referral = require('../api/models/referral');
const jwt = require('jsonwebtoken');
const { testSecretKey } = require('../api/config/static-data');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

jest.mock('../api/models/user');
jest.mock('../api/models/link');
jest.mock('../api/models/referral');

afterEach(() => {
    jest.clearAllMocks();
});

const app = express();
app.use(express.json());
app.use('/api/links', require('../api/routes/links'));
const endpointHost = `${process.env.BASE_URL}:${process.env.PORT}`;

// For Authenticated Users Only
describe('Links Routes', () => {

    // Get All Links
    describe('GET /api/links', () => {

        // 401 - Unauthorized!
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/links')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                message: 'Unauthorized!',
            });

            // additional assertions
            expect(jwt.verify).not.toHaveBeenCalled();
            expect(User.findById).not.toHaveBeenCalled();
            expect(Link.find).not.toHaveBeenCalled();
        });

        // 200 - Links retrieved successfully.
        it('should return 200 and all links', async () => {
            const token = 'validBearerToken';
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                isAdmin: false,
            };

            jwt.verify.mockReturnValue({ id: existingUser._id });
            User.findById.mockResolvedValue(existingUser);

            const existingLinks = [
                { referral_key: '1111aaaa', referral_endpoint: `${endpointHost}/api/links/1111aaaa` },
                { referral_key: '2222bbbb', referral_endpoint: `${endpointHost}/api/links/2222bbbb` },
            ];

            Link.find.mockResolvedValue(existingLinks);

            const res = await request(app)
                .get('/api/links')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: existingLinks,
                message: 'Links retrieved successfully.',
            });

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).toHaveBeenCalledWith(existingUser._id);
            expect(Link.find).toHaveBeenCalledWith({ user: existingUser._id });
        });

    });

    // Create Link
    describe('POST /api/links', () => {

        // 201 - Link created successfully.
        it('should create a new link and return 201', async () => {
            const token = 'validBearerToken';
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                isAdmin: false,
            };

            jwt.verify.mockReturnValue({ id: existingUser._id });
            User.findById.mockResolvedValue(existingUser);
            Link.create.mockResolvedValue({ referral_key: '1234abcd' });

            const res = await request(app)
                .post('/api/links')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                data: {
                    referral_key: '1234abcd',
                    referral_endpoint: `${endpointHost}/api/links/1234abcd`,
                },
                message: 'Link created successfully.',
            });

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).toHaveBeenCalledWith(existingUser._id);
            expect(Link.create).toHaveBeenCalledWith({ user: existingUser._id });
        });

    });

    // Get Referral Link
    describe('GET /api/links/:referral_key', () => {

        // 404 - Link not found!
        it('should return 404 if link is not found', async () => {
            const token = 'validBearerToken';
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                isAdmin: false,
            };

            jwt.verify.mockReturnValue({ id: existingUser._id });
            User.findById.mockResolvedValue(existingUser);
            Link.findOne.mockResolvedValue(null);

            const referral_key = '00000000';
            const res = await request(app)
                .get(`/api/links/${referral_key}`)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: 'Link not found!',
            });

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).toHaveBeenCalledWith(existingUser._id);
            expect(Link.findOne).toHaveBeenCalledWith({ referral_key });
        });

        // 200 - Information retrieved successfully.
        it('should return 200 and link details', async () => {
            const token = 'validBearerToken';
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                isAdmin: false,
            };

            jwt.verify.mockReturnValue({ id: existingUser._id });
            User.findById.mockResolvedValue(existingUser);

            const linkId = 'linkId';
            const referral_key = '1234abcd';
            Link.findOne.mockResolvedValue({
                _id: linkId,
                referral_key,
            });

            const referralsDetails = {
                used: 1,
            };
            Referral.countDocuments.mockResolvedValue(referralsDetails.used);

            const res = await request(app)
                .get(`/api/links/${referral_key}`)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({
                used: referralsDetails.used,
            });
            expect(res.body.message).toBe('Referral information retrieved successfully.');

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).toHaveBeenCalledWith(existingUser._id);
            expect(Link.findOne).toHaveBeenCalledWith({ referral_key });
            expect(Referral.countDocuments).toHaveBeenCalledWith({ link: linkId });
        });

    });

});
