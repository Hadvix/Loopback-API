const express = require('express');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const LOOPBACK_ROUTE = '/loopback';
const ROOT_ROUTE = '/';

const ROOT_RESPONSE = {
  name: 'loopback-api',
  purpose: 'Echo JSON payloads for Postman-based endpoint validation.',
};

const app = createApp();

if (require.main === module) {
  startServer(app);
}

module.exports = {
  DEFAULT_HOST,
  DEFAULT_PORT,
  LOOPBACK_ROUTE,
  ROOT_ROUTE,
  app,
  createApp,
  createRootResponse,
  normalizeLoopbackPayload,
  startServer,
};

/**
 * Build an Express application instance.
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();

  app.use(express.json());

  app.get(ROOT_ROUTE, (req, res) => {
    const responseBody = createRootResponse();
    res.status(200).json(responseBody);
  });

  app.post(LOOPBACK_ROUTE, (req, res) => {
    const responseBody = normalizeLoopbackPayload(req.body);
    res.status(200).json(responseBody);
  });

  return app;
}

/**
 * Create the static response returned by the root endpoint.
 * @returns {{name: string, purpose: string}}
 */
function createRootResponse() {
  return {
    name: ROOT_RESPONSE.name,
    purpose: ROOT_RESPONSE.purpose,
  };
}

/**
 * Normalize the payload returned by the loopback endpoint.
 * @param {unknown} payload
 * @returns {unknown}
 */
function normalizeLoopbackPayload(payload) {
  if (payload === undefined) {
    return {};
  }

  return payload;
}

/**
 * Start the HTTP server.
 * @param {import('express').Express} app
 * @param {string} host
 * @param {number} port
 * @returns {import('http').Server}
 */
function startServer(app, host = DEFAULT_HOST, port = DEFAULT_PORT) {
  return app.listen(port, host, () => {
    console.log(`Listening on ${host} port ${port}...`);
  });
}
