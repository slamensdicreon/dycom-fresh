#!/usr/bin/env node
// Zero-dependency static server for the Final Design Direction package.
//
//   node serve.mjs            → http://localhost:8080/
//   PORT=3000 node serve.mjs  → http://localhost:3000/
//
// The site is a single-page application: any path that is not a file
// (investors/, design-system/…) is answered with index.html and routed in the
// browser. Any other static server with the same fallback works too.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.map': 'application/json',
};

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = join(root, normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
  const type = types[extname(file)] ?? 'application/octet-stream';
  const stat = statSync(file);
  const headers = { 'Content-Type': type, 'Content-Length': stat.size };
  if (type.startsWith('video/') && req.headers.range) {
    const [startText, endText] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startText);
    const end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Final Design Direction → http://localhost:${port}/`));
