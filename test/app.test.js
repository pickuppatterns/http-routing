const  mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });
  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  const createPerson = name => { 
    return request(app)
      .post('/people')
      .send({
        name,
        age:100,
        favoriteColor: 'red'
      })
      .then (res => res.body);
  };

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send ({
        name:'Vic Demise',
        age: 30,
        favoriteColor:'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name:'Vic Demise',
          age: 30,
          favoriteColor:'red',
          _id: expect.any(String)
        });
      });
  });
  it('gets a list of people from our db', () => {
    const namesToCreate = ['Robin D Cradle', 'Saul Goodman', 'Jay Qarry', 'Michael Deadhands'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(()=> {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('finds a user by ID', () => {
    const id = createPerson.id;
    return request(app)
      .get(`/people/${id}`)
      .then(res => expect(res.body.name).toEqual(createPerson.id));
  });


});