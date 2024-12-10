
// const { connectDB, closeDB } = require('../api/config/database');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../api/server');
const { sampleData, cleanTestData } = require('./helpers');

const apiUriPrefix = '/api';

before(async () => {
    // await connectDB();
    
    // Make sure to clean test data before starting the test
    await cleanTestData(sampleData.referrer.email, sampleData.referee.email);
});

// after(async () => {
//     await closeDB();
// });

describe('API Endpoints', () => {

    let bearerToken = '';
    let sampleReferralKey = '';

    // Root URL
    it('Should return success message for root URL', (done) => {
        request(app)
            .get(`${apiUriPrefix}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('message').eq('Root URL');
                done();
            });
    });

    // Referrer Registration
    it('Should return registered referrer data', (done) => {
        request(app)
            .post(`${apiUriPrefix}/users/register`)
            .send({
                name: sampleData.referrer.name,
                email: sampleData.referrer.email,
                password: sampleData.referrer.password,
                // referral_key: '',
            })
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('name').eq(sampleData.referrer.name);
                expect(res.body.data).to.have.property('email').eq(sampleData.referrer.email);
                done();
            });
    });

    // Referral Login
    it('Should return logged in user data', (done) => {
        request(app)
            .post(`${apiUriPrefix}/users/login`)
            .send({
                email: sampleData.referrer.email,
                password: sampleData.referrer.password,
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('name').eq(sampleData.referrer.name);
                expect(res.body.data).to.have.property('email').eq(sampleData.referrer.email);

                bearerToken = res.body.data.token;

                done();
            });
    });

    // Get Authorized User Profile
    it('Should return authorized user profile', (done) => {
        request(app)
            .get(`${apiUriPrefix}/users/profile`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('name').eq(sampleData.referrer.name);
                expect(res.body.data).to.have.property('email').eq(sampleData.referrer.email);
                done();
            });
    });

    // Create Referral Link
    it('Should return created referral link', (done) => {
        request(app)
            .post(`${apiUriPrefix}/links`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                done();
            });
    });

    // Referee Registration
    it('Should return registered referee data', (done) => {
        request(app)
            .post(`${apiUriPrefix}/users/register`)
            .send({
                name: sampleData.referee.name,
                email: sampleData.referee.email,
                password: sampleData.referee.password,
                referral_key: sampleReferralKey,
            })
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('name').eq(sampleData.referee.name);
                expect(res.body.data).to.have.property('email').eq(sampleData.referee.email);
                done();
            });
    });

    // Get Referral Links Created by User
    it('Should return referral links created by user', (done) => {
        request(app)
            .get(`${apiUriPrefix}/links`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');

                const links = res.body.data;
                expect(links).to.be.an('array');
                if (links.length > 0) {
                    sampleReferralKey = links[0].referral_key;
                }

                done();
            });
    });

    // Get Referral Data
    it('Should return referral data (count of referrals registered)', (done) => {
        request(app)
            .get(`${apiUriPrefix}/links/${sampleReferralKey}`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('success').eq(true);
                expect(res.body).to.have.property('data');
                done();
            });
    });

});
