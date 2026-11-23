const { createServer } = require('../src/app');

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('root reports the project name and running service', async () => {
  const response = await fetch(baseUrl);
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('application/json');
  expect(await response.json()).toEqual({
    project: 'CI/CD Final Project', message: 'SERVICERUNNING'
  });
});

test('health endpoint supports OpenShift probes', async () => {
  const response = await fetch(`${baseUrl}/health`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok' });
});

test('unknown paths return 404', async () => {
  const response = await fetch(`${baseUrl}/missing`);
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: 'Not found' });
});

test('unsupported methods return 405 and advertise GET', async () => {
  const response = await fetch(baseUrl, { method: 'POST' });
  expect(response.status).toBe(405);
  expect(response.headers.get('allow')).toBe('GET');
  expect(await response.json()).toEqual({ error: 'Method not allowed' });
});
