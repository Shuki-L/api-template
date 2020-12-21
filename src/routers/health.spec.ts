import chai = require('chai');

import express = require('express');
import supertest = require('supertest');

const should = chai.should;
const expect = chai.expect;

describe('health API', () => {
    let app;
    let request;
    let route;

    before(() => {
        app = express();

        route = require('./health');
        app.use('/api/v1/health', route);

        request = supertest(app);
    });

    it('should respond with 200 and a status OK', () => {
        request
            .get('/api/v1/health')
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                should().not.exist(err);
                expect(res.body).to.deep.equal({
                    description: 'Status OK',
                    status: 200,
                });
            });
    });
});
