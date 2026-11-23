const { createServer } = require('./app');
const port = Number(process.env.PORT || 8000);
const server = createServer();

server.listen(port, '0.0.0.0', () => {
  console.log('========================================');
  console.log(`SERVICERUNNING on port ${port}`);
  console.log('========================================');
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
