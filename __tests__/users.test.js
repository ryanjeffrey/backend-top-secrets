const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const mockUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: '12345',
  };

  it('POST /api/v1/users creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    expect(res.status).toBe(200);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });

    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toEqual(200);
    expect(res.body.message).toBe('Signed out successfully!');
  });

  afterAll(() => {
    pool.end();
  });
});
