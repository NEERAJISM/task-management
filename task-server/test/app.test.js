const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tasks API", () => {
  describe("GET /api/status", () => {
    it("should return success status", (done) => {
      chai
        .request(app)
        .get("/api/status")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /api/fetch/test_user", () => {
    it("should give 403 without Auth token", (done) => {
      chai
        .request(app)
        .get("/api/fetch/test_user")
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });

  describe("GET /api/fetch/test_user", () => {
    it("should give 401 with invalid Auth token", (done) => {
      chai
        .request(app)
        .get("/api/fetch/test_user")
        .set("Authorization", "test")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
