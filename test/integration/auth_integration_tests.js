process.env.NODE_ENV = 'test';

// const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../../models/user');

chai.use(chaiHttp);
const should = chai.should();

const app = require('../../app');

const testUser = {
  username: 'test',
  email: 'test@email.com',
  password: 'test'
};


describe('Auth routes tests', () => {
  beforeEach((done) => {
    User.remove({})
      .then(_ => User.create(testUser))
      .then(_ => done());
  });

  describe('POST /auth/login', () => {
    it('it should login successfully an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          response.body.should.have.property('token');
          response.body.should.have.property('expiresIn');
          response.body.should.have.property('userId');
          done();
        });
    });

    it('it should return an error', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'unknown',
          password: 'unknown'
        })
        .end((error, response) => {
          should.not.exist(error);
          response.status.should.eql(401);
          response.body.status.should.eql('error');
          done();
        });
    });
  });

  after((done) => {
    User.remove({})
      .then(_ => done());
  });
});
