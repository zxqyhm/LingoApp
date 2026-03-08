const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const distDir = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url);
  
  // 如果是根路径，返回 index.html
  if (filePath === path.join(distDir, '/')) {
    filePath = path.join(distDir, 'index.html');
  }
  
  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，返回 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        // 其他错误，返回 500
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
      }
    } else {
      // 根据文件扩展名设置内容类型
      const extname = path.extname(filePath);
      let contentType = 'text/html';
      
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.ico':
          contentType = 'image/x-icon';
          break;
      }
      
      // 返回文件内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
