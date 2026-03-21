const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const {
  createApp,
  LOOPBACK_ROUTE,
  ROOT_ROUTE,
  startServer
} = require('../loopback');

/**
 * Send an HTTP request against the temporary test server.
 * @param {number} port
 * @param {{method: string, path: string, body?: string, headers?: Record<string, string>}} options
 * @returns {Promise<{statusCode: number, body: string, headers: http.IncomingHttpHeaders}>}
 */
function sendRequest(port, options) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host: '127.0.0.1',
        port,
        method: options.method,
        path: options.path,
        headers: options.headers
      },
      (response) => {
        let responseBody = '';

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          responseBody += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            body: responseBody,
            headers: response.headers
          });
        });
      }
    );

    request.on('error', reject);

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });
}

test('GET / returns utility metadata', async () => {
  const app = createApp();
  const server = startServer(app, '127.0.0.1', 0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  try {
    const address = server.address();
    const port = address.port;
    const response = await sendRequest(port, {
      method: 'GET',
      path: ROOT_ROUTE
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), {
      name: 'loopback-api',
      purpose: 'Echo JSON payloads for Postman-based endpoint validation.'
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});

test('POST /loopback returns the same JSON payload', async () => {
  const app = createApp();
  const server = startServer(app, '127.0.0.1', 0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  try {
    const address = server.address();
    const port = address.port;
    const requestBody = JSON.stringify({
      customerId: 42,
      valid: true,
      tags: ['draft', 'postman']
    });
    const response = await sendRequest(port, {
      method: 'POST',
      path: LOOPBACK_ROUTE,
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody).toString()
      }
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), JSON.parse(requestBody));
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});

test('POST /loopback returns an empty object for an empty JSON request', async () => {
  const app = createApp();
  const server = startServer(app, '127.0.0.1', 0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  try {
    const address = server.address();
    const port = address.port;
    const response = await sendRequest(port, {
      method: 'POST',
      path: LOOPBACK_ROUTE,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), {});
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
