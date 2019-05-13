const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../expressApp');
const server = require('http').createServer(app);
const { fyi } = require('../custom_modules/colormessage');
const PORT = process.env.PORT;
const status = (`\n\t\t\tServer listening on port: ${PORT}\n`);
console.log(`${status}`);

beforeEach(() => {
    server.listen(PORT,() => console.log(`\n\t\tServer started on port ${PORT}\n`));
});

afterEach(() => {
    server.close();
});

describe('Unit testing the / route', () => {

    it(fyi('should return OK status'), () => {
        return request(server)
            .get('/')
            .then(function (response) {
                assert.equal(response.status, 200)
                // console.log(response.status);
            })
            .catch(err => { 
                console.log(`\n\t\t${err.message}\n`);
            });
    });

});

/* describe('Unit testing the /admin route', () => {

    it(fyi('should return OK status'), () => {
        return request(server)
            .get('/admin')
            .then(function (response) {
                assert.equal(response.status, 200)
            })
            .catch(err => {
                console.log(`\n\t\t${err.message}\n`);
            });
    });

}); */

/* describe('Unit testing the /home route', () => {

    it(fyi('should return OK status'), () => {
        return request(server)
            .get('/home')
            // .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                // const json = JSON.parse(res.text);
                const statusCode = res.status;
                // assert.equal(json.title, 'home');
                assert.equal(statusCode, 200);
            });
    });

}); */


describe('Unit testing the /about route', () => {

    it(fyi('should return OK status'), () => {
        return request(server)
            .get('/about')
            .then(function (response) {
                assert.equal(response.status, 200)
                // console.log(response.status);
            })
            .catch(err => {
                console.log(`\n\t\t${err.message}\n`);
            });
    });

});