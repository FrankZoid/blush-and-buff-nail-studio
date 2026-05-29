const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HOST = '127.0.0.1';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Normalize url path and default to index.html for root path
    let urlPath = req.url === '/' ? '/index.html' : req.url;
    // Strip query parameters
    urlPath = urlPath.split('?')[0];

    // Decode URL characters (e.g. spaces represented as %20)
    let decodedUrlPath;
    try {
        decodedUrlPath = decodeURIComponent(urlPath);
    } catch (e) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
    }

    // Resolve relative path to the current directory
    const filePath = path.join(__dirname, decodedUrlPath);
    
    // Security check: ensure path resides inside current directory structure
    if (!filePath.startsWith(__dirname)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('403 Forbidden');
        return;
    }

    // Read the static file from storage
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('404 Not Found');
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`500 Server Error: ${err.code}`);
            }
        } else {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Blush & Buff Local Server is running at http://${HOST}:${PORT}/`);
    console.log('Press Ctrl+C to terminate.');
});
