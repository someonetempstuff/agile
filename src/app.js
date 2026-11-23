const http = require('node:http');

function createServer() {
  return http.createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    if (request.url === '/') {
      response.writeHead(200);
      response.end(JSON.stringify({ project: 'CI/CD Final Project', message: 'SERVICERUNNING' }));
      return;
    }
    if (request.url === '/health') {
      response.writeHead(200);
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    response.writeHead(404);
    response.end(JSON.stringify({ error: 'Not found' }));
  });
}

module.exports = { createServer };
