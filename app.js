const fs = require('fs');
const path = require('path');
const registerUser = require('./backend/register');
const loginUser = require('./backend/login');

module.exports = (req, res) => {
  const urlsplit = req.url.split('/');

  if (req.method === "POST" && urlsplit[1] === "register") {
    registerUser(req, res);
  }
  else if (req.method === "POST" && urlsplit[1] === "login") {
    loginUser(req, res);
  }
  else if (req.method === "GET" && req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'style.css'), (err, css) => {
      if (err) {
        res.writeHead(404);
        return res.end('CSS not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
    });
  }
  else if (req.method === "GET" && req.url === '/register.html') {
    fs.readFile(path.join(__dirname, 'register.html'), (err, html) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  }
  else if (req.method === "GET" && req.url === '/dashboard.html') {
    fs.readFile(path.join(__dirname, 'dashboard.html'), (err, html) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  }
  else {
    // Default: show login.html
    fs.readFile(path.join(__dirname, 'login.html'), (err, html) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  }
};
