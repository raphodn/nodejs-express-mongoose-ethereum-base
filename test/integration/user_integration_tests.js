process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
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


describe('Users routes tests', () => {
  beforeEach((done) => {
    User.remove({})
      .then(_ => User.create(testUser))
      .then(_ => done());
  });

  describe('GET /users', () => {
    it('it should GET all the users (1)', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          chai.request(app)
            .get('/api/v1/users')
            .set('x-access-token', response.body.token)
            .end((err, res) => {
              res.status.should.eql(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
            });
        });
    });

    it('it should GET all the users (2)', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          User.create({
            username: 'new1',
            email: 'new1@email.com',
            password: 'new1'
          })
            .then((user) => {
              chai.request(app)
                .get('/api/v1/users')
                .set('x-access-token', response.body.token)
                .end((err, res) => {
                  res.status.should.eql(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(2);
                  res.body[1].should.have.property('_id').eql(user.id);
                  res.body[1].should.have.property('username').eql(user.username);
                  done();
                });
            });
        });
    });
  });

  describe('GET /users/:user_id', () => {
    it('it should GET a user by the given id', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          User.create({
            username: 'new2',
            email: 'new2@email.com',
            password: 'new2'
          })
            .then((user) => {
              chai.request(app)
                .get(`/api/v1/users/${user.id}`)
                .set('x-access-token', response.body.token)
                .end((err, res) => {
                  res.status.should.eql(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('_id').eql(user.id);
                  res.body.should.have.property('username').eql(user.username);
                  done();
                });
            });
        });
    });

    it('it should return a 404 if the user does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          chai.request(app)
            .get(`/api/v1/users/${mongoose.Types.ObjectId()}`)
            .set('x-access-token', response.body.token)
            .end((err, res) => {
              res.status.should.eql(404);
              res.body.should.be.a('object');
              done();
            });
        });
    });
  });

  describe('POST /users', () => {
    it('it should create a new user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .end((error, response) => {
          should.not.exist(error);
          response.body.status.should.eql('success');
          chai.request(app)
            .post('/api/v1/users')
            .send({
              username: 'new3',
              email: 'new3@email.com',
              password: 'new3'
            })
            .set('x-access-token', response.body.token)
            .end((err, res) => {
              res.status.should.eql(201);
              res.body.should.be.a('object');
              res.body.should.have.property('username').eql('new3');
              done();
            });
        });
    });
  });

  // TODO
  // describe('PUT /users/:user_id', () => {
  // });

  // TODO
  // describe('DELETE /users/:user_id', () => {
  // });

  after((done) => {
    User.remove({})
      .then(_ => done());
  });
});
