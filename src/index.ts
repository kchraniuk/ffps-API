import { FpsApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { FpsApplication };

export * from './websocket.server';
export * from './decorators/websocket.decorator';
export * from './websocket-controller-factory';

export async function main(options: ApplicationConfig = {}) {
  const app = new FpsApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
