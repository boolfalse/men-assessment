
const request = require('supertest');
const { describe, expect, it } = require('@jest/globals');
const express = require('express');
const User = require('../api/models/user');
const Link = require('../api/models/link');
const Referral = require('../api/models/referral');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { referral_key_length, user_password, testSecretKey } = require('../api/config/static-data');

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
app.use('/api/users', require('../api/routes/users'));

// Register, Login, Profile
describe('User Routes', () => {

    // Register
    describe('POST /api/users/register', () => {

        // 422 - Validation error!
        it('should return 422 if validation fails', async () => {
            const invalidUser = {
                name: '',
                email: 'invalid-email',
                password: 'short',
                referral_key: 'invalidKey'
            };

            const res = await request(app)
                .post('/api/users/register')
                .send(invalidUser)
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(422);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Name can't be empty!/);
            expect(res.body.message).toMatch(/Invalid email address!/);
            expect(res.body.message).toMatch(`Password must be between ${user_password.min_length} and ${user_password.max_length} characters!`);
            expect(res.body.message).toMatch(`Referral key must be ${referral_key_length} characters!`);
        });

        // 400 - User already exists!
        it('should return 400 if user already exists', async () => {
            const existingUser = {
                isAdmin: false,
                name: 'Existing User',
                email: 'existing.user@example.com',
                password: 'password',
                referral_key: '1234abcd'
            };

            User.findOne.mockResolvedValue({ email: existingUser.email });

            const res = await request(app)
                .post('/api/users/register')
                .send(existingUser)
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'User already exists!'
            });
        });

        // 201 - User created successfully.
        it('should create a new user and return 201', async () => {
            const newUser = {
                _id: 'userId',
                name: 'New User',
                email: 'new.user@example.com',
                password: 'hashedPassword',
                referral_key: '1234abcd'
            };
            const referralLink = {
                _id: 'linkId',
                referral_key: '1234abcd'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue(newUser.password);
            User.create.mockResolvedValue(newUser);
            Link.findOne.mockResolvedValue(referralLink);
            Referral.create.mockResolvedValue({});

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    referral_key: newUser.referral_key,
                })
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                success: true,
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                message: 'User created successfully.',
            });

            expect(Link.findOne).toHaveBeenCalledWith({ referral_key: referralLink.referral_key });
            expect(Referral.create).toHaveBeenCalledWith({ user: newUser._id, link: referralLink._id });

            // additional assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: newUser.email });
            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 'salt');
            expect(User.create).toHaveBeenCalledWith({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            });
        });

    });

    // Login
    describe('POST /api/users/login', () => {

        // 400 - User does not exist!
        it('should return 400 if user does not exist', async () => {
            const randomEmail = Math.random().toString(36).substring(7) + '@example.com';

            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: randomEmail,
                    password: 'password'
                })
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'User does not exist!'
            });
        });

        // 400 - Incorrect password!
        it('should return 400 if password is incorrect', async () => {
            const wrongPassword = 'wrongPassword';
            const existingUserEmail = 'existing.user@example.com';

            User.findOne.mockResolvedValue({
                email: existingUserEmail,
                password: wrongPassword
            });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: existingUserEmail,
                    password: wrongPassword
                })
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'Incorrect password!'
            });
        });

        // 200 - User logged in successfully.
        it('should return 200 and token if login is successful', async () => {
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                password: 'hashedPassword'
            };

            User.findOne.mockResolvedValue(existingUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('validToken');

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: existingUser.email,
                    password: existingUser.password,
                })
                .expect('Content-Type', /json/);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: {
                    token: 'validToken',
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                },
                message: 'User logged in successfully.',
            });

            // additional assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: existingUser.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(existingUser.password, existingUser.password);
            expect(jwt.sign).toHaveBeenCalledWith({ id: existingUser._id }, testSecretKey, { expiresIn: '1d' });
        });

    });

    // Profile
    describe('Authenticated User Profile Endpoint', () => {

        // 401 - Unauthorized!
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                message: 'Unauthorized!',
            });

            // additional assertions
            expect(jwt.verify).not.toHaveBeenCalled();
            expect(User.findById).not.toHaveBeenCalled();
        });

        // 401 - Unauthorized!
        it('should return 401 if token is invalid', async () => {
            const token = 'invalidToken';
            jwt.verify.mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                message: 'Unauthorized!',
            });

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).not.toHaveBeenCalled();
        });

        // 200 - User profile retrieved successfully.
        it('should return 200 and user profile', async () => {
            const token = 'validBearerToken';
            const existingUser = {
                _id: 'userId',
                name: 'Existing User',
                email: 'existing.user@example.com',
                isAdmin: false,
            };

            jwt.verify.mockReturnValue({ id: existingUser._id });
            User.findById.mockResolvedValue(existingUser);

            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                data: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                },
                message: 'User profile retrieved successfully.',
            });

            // additional assertions
            expect(jwt.verify).toHaveBeenCalledWith(token, testSecretKey);
            expect(User.findById).toHaveBeenCalledWith(existingUser._id);
        });

    });

});
