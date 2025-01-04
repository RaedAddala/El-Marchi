import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { waitForServer } from './test-setup';

let server: ChildProcess;

export default async function globalSetup() {
  console.log('Starting server...');

  const serverPath = path.join(process.cwd(), 'dist', 'el-marchi-api', 'main.js');

  console.log('Server path:', serverPath);

  server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: '3000'
    },
    cwd: path.join(process.cwd())
  });

  server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });

  (global as any).__SERVER__ = server;

  try {
    await waitForServer();
    console.log('Server is ready');
  } catch (error) {
    console.error('Server failed to become ready:', error);
    server.kill('SIGTERM');
    process.exit(1);
  }
}
