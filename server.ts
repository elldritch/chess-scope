import * as path from 'path';

import * as express from 'express';

import { createProxyServer } from 'http-proxy';

// Initialise config.
const TACSCOPE_HOST = process.env.TACSCOPE_HOST || 'localhost';
const TACSCOPE_PORT = +(process.env.TACSCOPE_PORT || 8080);

if (isNaN(TACSCOPE_PORT)) {
  console.log('$TACSCOPE_PORT must be a number.');
  process.exit(1);
}

// Set up proxy servers.
const httpProxy = createProxyServer({
  target: 'https://lichess.org',
  changeOrigin: true,
  cookieDomainRewrite: '',
});

httpProxy.on('proxyReq', (proxyReq, req, res) => {
  // Strip `Origin: ` header, otherwise lichess.org returns 403 Forbidden ("Cross origin request forbidden.").
  proxyReq.removeHeader('origin');
});

httpProxy.on('proxyRes', (proxyRes, req, res) => {
  // Strip `Secure; ` from `set-cookie` header so cookie works over HTTP (i.e. localhost).
  const setCookies = proxyRes.headers['set-cookie'];
  if (setCookies) {
    proxyRes.headers['set-cookie'] = setCookies.map(cookie => cookie.replace('Secure; ', ''));
  }
});

const wsProxy = createProxyServer({
  target: 'wss://socket.lichess.org',
  changeOrigin: true,
  ws: true,
});

// Set up routing stack.
const app = express();

app.use('/api', (req, res) => httpProxy.web(req, res));
app.use('/assets', express.static(path.join(__dirname, 'app', 'assets')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'app', 'index.html')));

// Listen.
console.log(`Listening on ${TACSCOPE_HOST}:${TACSCOPE_PORT}`);

const server = app.listen(TACSCOPE_PORT);
server.on('upgrade', (req, socket, head) => wsProxy.ws(req, socket, head));
