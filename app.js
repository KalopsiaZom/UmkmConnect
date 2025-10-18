const fs = require('fs');
const path = require('path');
const registerUser = require('./backend/register');
const loginUser = require('./backend/login');

const tampilUsers = require('./backend/admin'); // 👈 add this (your query file)
const koneksi = require('./backend/koneksi');

module.exports = async (req, res) => {
    const urlsplit = req.url.split('/');

    if (req.method === "POST" && urlsplit[1] === "register") {
        return registerUser(req, res);
    } 
    else if (req.method === "POST" && urlsplit[1] === "login") {
        return loginUser(req, res);
    } 

  else if (req.method === "GET" && req.url === "/api/users") {
    tampilUsers((err, results) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Database error", details: err.message }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    });
  }

    //CSS serving
    else if (req.method === "GET" && req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'frontend', 'style.css'), (err, css) => {
        if (err) {
            res.writeHead(404);
            return res.end('CSS not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);
        });
    } 
    else if (req.method === "GET" && req.url === '/dashboard.css') {
        fs.readFile(path.join(__dirname, 'frontend', 'dashboard.css'), (err, css) => {
        if (err) {
            res.writeHead(404);
            return res.end('CSS not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);
        });
    } 
    else if (req.method === "GET" && req.url === '/admin.css') {
        fs.readFile(path.join(__dirname, 'frontend', 'admin.css'), (err, css) => {
        if (err) {
            res.writeHead(404);
            return res.end('CSS not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);
        });
    } 

    //HTML serving
    else if (req.method === "GET" && req.url === '/register.html') {
        fs.readFile(path.join(__dirname, 'frontend', 'register.html'), (err, html) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        });
    } 
    else if (req.method === "GET" && req.url === '/dashboard.html') {
        fs.readFile(path.join(__dirname, 'frontend', 'dashboard.html'), (err, html) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        });
    }
    else if (req.method === "GET" && req.url === '/admin.html') {
        fs.readFile(path.join(__dirname, 'frontend', 'admin.html'), (err, html) => {
            if (err) {
            res.writeHead(404);
            return res.end('File not found');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    }
    
    else {
        fs.readFile(path.join(__dirname, 'frontend', 'login.html'), (err, html) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        });
    }
};
