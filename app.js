const fs = require('fs');
const tampilBarang = require('./tampil_data');
const simpanBarang = require('./simpan_data');
const hapusBarang = require('./delete_data');
const editBarang = require('./edit_data');

module.exports = (req, res) => {
    const urlsplit = req.url.split('/');

    if (req.method === "POST" && urlsplit[1] === "simpan") {
        simpanBarang(req, res);
    } 
    else if (req.method === "GET" && urlsplit[1] === "delete") {
        hapusBarang(req, res, urlsplit[2]);
    } 
    else if (req.method === "GET" && urlsplit[1] === "edit") {
        editBarang.editData(req, res, urlsplit[2]);
    } 
    else if (req.method === "POST" && urlsplit[1] === "update") {
        editBarang.updateBarang(req, res); 
    } 
    else if (req.method === 'GET' && req.url === '/style.css') {
        fs.readFile(__dirname + '/style.css', (err, css) => {
            if (err) {
                res.writeHead(404);
                return res.end('CSS not found');
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(css);
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(__dirname + "/form.html", (err, data) => {
            if (err) {
                res.write("Error loading form");
                res.end();
            } else {
                res.write(data);
                tampilBarang(res);
            }
        });
    }

};
