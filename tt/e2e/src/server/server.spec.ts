import axios from 'axios';
import { waitForServer } from '../support/test-setup';

describe('API E2E Tests', () => {
  beforeAll(async () => {
    await waitForServer();
  });

  it('should return a message from /api endpoint', async () => {
    const res = await axios.get('/api');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});
