import { ChildProcess } from 'child_process';

export default async function globalTeardown() {
  const server = (global as any).__SERVER__ as ChildProcess;

  if (server) {
    console.log('Shutting down server...');
    server.kill('SIGTERM');

    await new Promise<void>((resolve) => {
      server.on('exit', () => {
        console.log('Server shutdown complete');
        resolve();
      });
    });
  }
}
