import * as path from 'path';

import * as express from 'express';

import { createProxyServer } from 'http-proxy';

// Initialise config.
const TACSCOPE_HOST = process.env.TACSCOPE_HOST || 'localhost';
const TACSCOPE_PORT = +(process.env.TACSCOPE_PORT || 8080);

if (isNaN(TACSCOPE_PORT)) {
  // tslint:disable-next-line:no-console
  console.log('$TACSCOPE_PORT must be a number.');
  process.exit(1);
}

// Set up HTTP proxy.
const httpProxy = createProxyServer({
  changeOrigin: true,
  cookieDomainRewrite: '',
  target: 'https://lichess.org',
});

httpProxy.on('proxyReq', (proxyReq, req, res) => {
  // Strip `Origin: ` header, otherwise lichess.org returns 403 Forbidden ("Cross origin request forbidden.").
  proxyReq.removeHeader('origin');
});

httpProxy.on('proxyRes', (proxyRes, req, res) => {
  // Strip `Secure; ` from `set-cookie` header so cookie works over HTTP (i.e. localhost).
  const setCookies = proxyRes.headers['set-cookie'];
  if (setCookies) {
    proxyRes.headers['set-cookie'] = setCookies.map((cookie) => cookie.replace('Secure; ', ''));
  }
});

// Set up WebSocket proxy.
const wsProxy = createProxyServer({
  changeOrigin: true,
  target: 'wss://socket.lichess.org',
  ws: true,
});

wsProxy.on('proxyReqWs', (proxyReq, req, res) => {
  proxyReq.removeHeader('origin');
});

// Set up routing stack.
const app = express();

app.use('/api', (req, res) => httpProxy.web(req, res));
app.use('/assets', express.static(path.join(__dirname, 'app', 'assets')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'app', 'index.html')));

// Listen.
// tslint:disable-next-line:no-console
console.log(`Listening on ${TACSCOPE_HOST}:${TACSCOPE_PORT}`);

const server = app.listen(TACSCOPE_PORT);
server.on('upgrade', (req, socket, head) => {
  wsProxy.ws(req, socket, head);
});
