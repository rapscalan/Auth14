require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(()=> {
    connect();
  });
  
  beforeEach(()=> {
    return mongoose.connection.dropDatabase();
  });

  afterAll(()=> {
    return mongoose.connection.close();
  });

  it('can signup a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  // it('can verify if a user is logged in', async() => {
  //   const user = await User.create({
  //     email: 'test@test.com',
  //     password: 'password'
  //   });
  //   const agent = request.agent(app);
  //   await agent
  //     .post('/api/v1/auth/login')
  //     .send({ email: 'test@test.com', password: 'password' });

  //   await agent
  //     .get('/api/v1/auth/verify')
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: user.id,
  //         email: 'test@test.com',
  //         __v: 0
  //       });
  //     });
  // });
});
