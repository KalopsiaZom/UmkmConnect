const fs = require('fs');
const path = require('path');
const registerUser = require('./backend/register');
const loginUser = require('./backend/login');
const tampilUsers = require('./backend/admin');
const koneksi = require('./backend/koneksi');

module.exports = async (req, res) => {
  const urlsplit = req.url.split('/');

  if (req.method === "POST" && urlsplit[1] === "register") {
    return registerUser(req, res);
  } 
  else if (req.method === "POST" && urlsplit[1] === "login") {
    return loginUser(req, res);
  }

  // Getting all users for admin
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

  // Getting user by ID for editing
  else if (req.method === "GET" && req.url.startsWith("/api/user/")) {
    const id = req.url.split("/")[3];
    try {
      const [rows] = await koneksi.query("SELECT * FROM users WHERE id = ?", [id]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows[0]));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Updating user by ID
  else if (req.method === "POST" && req.url.startsWith("/api/edit/")) {
    const id = req.url.split("/")[3];
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const { username, email, role } = JSON.parse(body);
        const [result] = await koneksi.query(
          "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
          [username, email, role, id]
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated successfully", affectedRows: result.affectedRows }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

    // Deleting user by ID
    else if (req.method === "DELETE" && req.url.startsWith("/api/delete/")) {
    const id = req.url.split("/")[3];
    try {
        const [result] = await koneksi.query("DELETE FROM users WHERE id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User deleted successfully", affectedRows: result.affectedRows }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
    }
    }

    // Information Panel (SELECT)
    // Get UMKM info by user ID
    else if (req.method === "GET" && req.url.startsWith("/api/umkm/")) {
    const id = req.url.split("/")[3];
    try {
        const [rows] = await koneksi.query("SELECT * FROM umkm WHERE user_id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows[0] || {}));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
    }
    }

    // Get Investor info by user ID
    else if (req.method === "GET" && req.url.startsWith("/api/investor/")) {
    const id = req.url.split("/")[3];
    try {
        const [rows] = await koneksi.query("SELECT * FROM investor WHERE user_id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows[0] || {}));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
    }
    }

    // Information Panel (UPDATE)
    else if (req.method === "POST" && req.url.startsWith("/api/umkm/")) {
    const id = req.url.split("/")[3];
    let body = "";

    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
        try {
        const { business_name, business_desc, location, owner, category, revenue} = JSON.parse(body);

        await koneksi.query(
            "UPDATE umkm SET business_name=?, business_desc=?, location=?, owner=?, category=?, revenue=? WHERE user_id=?",
            [business_name, business_desc, location, owner, category, revenue, id]
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "UMKM info updated successfully" }));
        } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        }
    });
    }

    else if (req.method === "GET" && req.url.startsWith("/edit.html")) {
    fs.readFile(path.join(__dirname, 'public', 'edit.html'), (err, html) => {
        if (err) {
        res.writeHead(404);
        return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
    }


  // CSS Files
  else if (req.method === "GET" && req.url.endsWith(".css")) {
    const cssPath = path.join(__dirname, 'public', req.url);
    fs.readFile(cssPath, (err, css) => {
      if (err) {
        res.writeHead(404);
        return res.end('CSS not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
    });
  }

  // HTML Files
else if (req.method === "GET" && req.url.includes(".html")) {
  const cleanPath = req.url.split("?")[0]; // remove ?id=5 or others
  const htmlPath = path.join(__dirname, "public", cleanPath);

  fs.readFile(htmlPath, (err, html) => {
    if (err) {
      res.writeHead(404);
      return res.end("File not found");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
}


  // JS Files
  else if (req.method === "GET" && req.url.endsWith(".js")) {
    const jsPath = path.join(__dirname, 'public', req.url);
    fs.readFile(jsPath, (err, js) => {
      if (err) {
        res.writeHead(404);
        return res.end('JS not found');
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(js);
    });
  }

  // Default to login page
  else {
    fs.readFile(path.join(__dirname, 'public', 'login.html'), (err, html) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  }
};
