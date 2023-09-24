const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/index.js");
const expect = chai.expect;

chai.use(chaiHttp);

const agent = chai.request.agent(app);

before(function (done) {
  this.timeout(30000); // Set the timeout to 30 seconds
  agent
    .post("/login")
    .send({ username: "admin", password: "admin" })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res).to.have.status(200);
      done();
    });
});

describe("Connection API Endpoints", () => {
  // Test for fetching all connections
  describe("GET /api/connections", () => {
    it("should fetch all connections", (done) => {
      agent.get("/api/connections").end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
    });
  });
});

describe("Connection Routes and core functionality", () => {
  // Test for retrieving and grouping users by the first letter of their name
  describe("GET /mark-met", () => {
    it("should retrieve and group users", (done) => {
      agent.get("/mark-met").end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  // Test for retrieving members that the current user has met
  describe("GET /members-met", () => {
    it("should retrieve members that the user has met", (done) => {
      agent.get("/members-met").end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  // Test for retrieving recommended users for the current user
  describe("GET /recommendations", () => {
    it("should retrieve recommended users", (done) => {
      agent.get("/recommendations").end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });
});

// Close the agent after all tests
after(() => agent.close());
