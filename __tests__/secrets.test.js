const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('secrets', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const mockUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: '12345',
  };

  it('GET /api/v1/secrets should return a list of secrets when logged in', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});
