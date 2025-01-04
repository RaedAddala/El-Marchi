import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Configure axios for tests
axios.defaults.baseURL = API_URL;
axios.defaults.validateStatus = () => true;

export async function waitForServer(timeout = 30000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get('/api');
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error(`Server failed to start within ${timeout}ms`);
}
