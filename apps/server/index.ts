import express from 'express';
import path from 'path';
import next from 'next';
import fetch from 'node-fetch'; // npm install node-fetch@2
import { spawn } from 'child_process';

const port = parseInt(process.env.PORT || '3000');
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: path.join(__dirname, '../web') });
const handle = app.getRequestHandler();

const server = express();

const dashboardPath = path.join(__dirname, '../dashboard/dist');
console.log('Serving dashboard from:', dashboardPath);

// Serve dashboard static files at /admin
server.use('/admin', express.static(dashboardPath));

// SPA fallback for dashboard (client side routing)
server.get('/admin/*', (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

// Proxy API requests to NestJS backend on port 4000
server.use('/api', async (req, res, next) => {
  try {
    const targetUrl = `https://ecommerce-monorepo-production.up.railway.app${req.originalUrl.replace(/^\/api/, '')}`;

    // Prepare headers, delete host header
    const headers = {...req.headers};
    delete headers.host;

    const fetchOptions: any = {
      method: req.method,
      headers,
      redirect: 'follow'
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req;
    }

    const proxyResponse = await fetch(targetUrl, fetchOptions);

    res.status(proxyResponse.status);
    proxyResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    proxyResponse.body.pipe(res);

  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).send('API proxy error');
  }
});

// Prepare Next.js app
app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// Spawn NestJS backend as a subprocess
const nestProcess = spawn('node', ['dist/main.js'], {
  cwd: path.join(__dirname, '../backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '4000' }
});

nestProcess.on('close', (code) => {
  console.log(`NestJS backend process exited with code ${code}`);
  process.exit(code || 0);
});
