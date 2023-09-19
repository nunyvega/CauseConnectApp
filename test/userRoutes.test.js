const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Routes', () => {

    describe('GET /login', () => {
        it('should render the login page', (done) => {
            chai.request(app)
                .get('/login')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include('Login'); 
                    done();
                });
        });
    });

    describe('GET /register', () => {
        it('should render the register page', (done) => {
            chai.request(app)
                .get('/register')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include('Register');
                    done();
                });
        });
    });

    describe('GET /user/preferences', () => {
        it('should redirect to login page if not authenticated', (done) => {
            chai.request(app)
                .get('/user/preferences')
                .redirects(0) // Do not follow redirects
                .end((err, res) => {
                    expect(res).to.have.status(302); // Expecting a redirect status
                    expect(res.headers.location).to.include('/login'); // Expecting a redirect to the login page
                    done();
                });
        });
    });

    describe('GET /', () => {
        it('should redirect to login page if not authenticated', (done) => {
            chai.request(app)
                .get('/')
                .redirects(0) // Do not follow redirects
                .end((err, res) => {
                    expect(res).to.have.status(302); // Expecting a redirect status
                    expect(res.headers.location).to.include('/login'); // Expecting a redirect to the login page
                    done();
                });
        });
    });

    describe('Users API ', () => {
        it('Not accessible without auth', (done) => {
            chai.request(app)
                .get('/api/users')
                .redirects(0) // Do not follow redirects
                .end((err, res) => {
                    expect(res).to.have.status(302); // Expecting a redirect status
                    expect(res.headers.location).to.include('/login'); // Expecting a redirect to the login page
                    done();
                });
        });
    });

});
