// Production static file server for AquaBophelo Frontend on Azure App Service
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.resolve(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Only handle GET and HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  // Health check endpoint for Azure App Service probes
  if (req.url === '/health' || req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', app: 'AquaBophelo-Web', timestamp: new Date().toISOString() }));
    return;
  }

  // Parse pathname from request URL
  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Resolve safe file path and prevent directory traversal
  let safePath = path.normalize(path.join(DIST_DIR, pathname));
  if (!safePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(safePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(safePath, res, req.method);
      return;
    }

    // If file has an extension (e.g. missing .png, .js), return 404 instead of falling back to SPA
    const ext = path.extname(pathname);
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    // SPA fallback: serve index.html for all client-side routes (e.g. /resident, /dashboard, /login)
    fs.stat(INDEX_HTML, (indexErr, indexStats) => {
      if (indexErr || !indexStats.isFile()) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('AquaBophelo distribution files not found. Please build the application.');
        return;
      }
      serveFile(INDEX_HTML, res, req.method, true);
    });
  });
});

function serveFile(filePath, res, method, isSpaFallback = false) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  };

  // Cache policy:
  // - Assets with hashes in /assets/ can be aggressively cached for 1 year
  // - HTML pages (including SPA fallback) must not be cached to ensure instant updates
  if (filePath.includes(path.sep + 'assets' + path.sep)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (ext === '.html' || isSpaFallback) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  } else {
    headers['Cache-Control'] = 'public, max-age=86400';
  }

  res.writeHead(200, headers);

  if (method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Error streaming file');
  });
  stream.pipe(res);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AquaBophelo Web Server listening on http://0.0.0.0:${PORT}`);
  console.log(`Serving static files from ${DIST_DIR}`);
});
