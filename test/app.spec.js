const app = require('../src/app');
const { API_KEY } = require('../src/config');

const sample = {
  id: 123,
  firstName: 'John',
  lastName : 'Dow',
  address1 : '48 Chicken Dinner rd',
  address2 : 'N/A',
  city : 'Huston' ,
  state : 'Idaho',
  zip : 83607 
};



describe('App', () => {
  it('GET / responds with 200 containing "OwO wi mwaking gwod pwa gwas!"', ()=> {
    return supertest(app)
      .get('/')
      .set('Authorization', `${API_KEY}`)
      .expect(200, 'OwO wi mwaking gwod pwa gwas!');
  });
});

describe(' GET /Address calls', () =>{
  it('should provide an json object', () =>{
    return supertest(app)
      .get('/address')
      .set('Authorization', `${API_KEY}`)
      .expect(200)
      .expect('Content-Type' ,/json/)
      .end((err,res)=>{
        if(err) throw err;
      });
  });

  it('should send back the data to the user, after it has been entered', () =>{
    return supertest(app)
      .post('/address')
      .set('Authorization', `${API_KEY}`)
      .send(sample)
      .expect(200)
      .then((res) => {
        expect(res.body.message, 'posted!');
      });
  });
});