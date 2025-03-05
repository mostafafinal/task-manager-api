import request from 'supertest';
import app from '../src/index';

describe('GET /', () => {
  it("should indicate that the server's working with greeting message", async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('Hello World!');
  });
});
