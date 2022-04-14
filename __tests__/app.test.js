require('dotenv').config();
const app = require('../app.js');
const request = require('supertest');

describe('describes test suite routes', () => {
  
  it('describes individual test', async () => {
    const message = 'hi';

    // Hi <@U0160GU2659>,

    // Congrats! You have a new match for *Account Executive*
    
    // *Name*: Karen Thompson
    // :mag: *Experience:* 10-20 years        
    // :sparkles: *Matched because:* Sales & Business Development
    
    // :page_facing_up: <https://www.linkedin.com/in/karenthompson/|LinkedIn>     

    const res = await request(app)
      .post('/test/business-matches')
      .send(message);

    expect(res.body).toEqual({message});
  });

});