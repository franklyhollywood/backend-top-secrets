const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/session').send({ email, password });
  return [agent, user];
};

const testSecret = {
  title: 'My Little Secret',
  description: 'This is not for you.  This is only for me.',
};

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user with hashed password', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('allows a user to login', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app).post('/api/v1/users/session').send(mockUser);
    expect(res.body).toEqual({
      message: 'Signed in successfully!',
    });
  });

  it('returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('deletes users session and logs out the user', async () => {
    const res = await agent.delete('/api/v1/users/session');

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });

  it('creates a secret only when a user is logged in', async () => {
    const [agent, user] = await registerAndLogin();
    const newSecret = await agent
      .post('/api/v1/secrets')
      .send({ ...testSecret });

    expect(newSecret.body).toEqual({
      createdAt: expect.any(String),
      id: expect.any(String),
      ...testSecret,
    });
  });

  it('Lists logged in users secrets', async () => {
    const [agent, user] = await registerAndLogin({ email: 'admin' });
    await agent.post('/api/v1/secrets').send({ ...testSecret });
    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual([
      { ...testSecret, id: expect.any(String), createdAt: expect.any(String) },
    ]);
  });
});
