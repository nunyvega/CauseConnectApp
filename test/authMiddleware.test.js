const chai = require('chai');
const expect = chai.expect;
const app = require('../src/index.js');
const session = require("express-session");

const ensureAuthenticated = require("../src/middleware/authMiddleware");
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

describe('Middleware Functions', () => {

    describe('ensureAuthenticated', () => {
        it('should redirect if user is not present', () => {
            const req = {
                isAuthenticated: () => false, // Mocking the isAuthenticated method
                flash: function(type, message) { // Mocking the flash method
                    this._flash = this._flash || {};
                    this._flash[type] = message;
                }
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/login');
                }
            };
            ensureAuthenticated(req, res, () => {});
        });
    });
});


