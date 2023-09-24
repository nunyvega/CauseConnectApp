const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index.js');
const expect = chai.expect;

chai.use(chaiHttp);

const agent = chai.request.agent(app);

before(function(done) {
    this.timeout(30000); // Set the timeout to 30 seconds
    agent
        .post('/login')
        .send({ username: 'admin', password: 'admin' })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res).to.have.status(200);
            done();
        });
});



describe('User Routes', () => {

    describe('Login page', () => {
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

    describe('Register page', () => {
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

    describe('Homepage limited access', () => {
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

    describe('Users API limited accesibility ', () => {
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

describe('Preferences form page', () => {
    it('should render the user preferences page when authenticated', (done) => {
        agent
            .get('/user/preferences')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Preferences');
                done();
            });
    });
});

describe('Homepage', () => {
    it('should render the home page when authenticated', (done) => {
        agent
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('met');
                done();
            });
    });
});

describe('All Users API for admin user ', () => {
    it('Accessible with auth', (done) => {
        agent
            .get('/api/users')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Test profile page for current user', () => {
    it('should render the profile of the currently logged-in user', (done) => {
        agent
            .get('/user/profile')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Bio'); 
                done();
            });
    });
});

describe('Test other users\' profile page', () => {
    it('should render the profile of a user specified by username', (done) => {
        agent
            .get('/user/admin2')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Bio');
                done();
            });
    });
});

after(() => agent.close());

