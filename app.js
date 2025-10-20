const fs = require('fs');
const path = require('path');
const registerUser = require('./backend/register');
const loginUser = require('./backend/login');
const tampilUsers = require('./backend/admin');
const tampilumkmUsers = require('./backend/adminumkm');
const tampilInvestorUsers = require('./backend/admininvestor');
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
  else if (req.method === "GET" && req.url.startsWith("/api/users")) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const search = urlObj.searchParams.get("search") || "";

    tampilUsers((err, results) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Database error", details: err.message }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }, search);
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

    // Deleting UMKM by ID
    else if (req.method === "DELETE" && req.url.startsWith("/api/deleteumkm/")) {
    const id = req.url.split("/")[3];
    try {
        const [result] = await koneksi.query("DELETE FROM umkm WHERE id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User deleted successfully", affectedRows: result.affectedRows }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
    }
    }

    // Deleting Investor by ID
    else if (req.method === "DELETE" && req.url.startsWith("/api/deleteinvestor/")) {
    const id = req.url.split("/")[3];
    try {
        const [result] = await koneksi.query("DELETE FROM investor WHERE id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User deleted successfully", affectedRows: result.affectedRows }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
    }
    }

    // Getting all UMKM users for admin
    else if (req.method === "GET" && req.url === "/api/umkmusers") {
        tampilumkmUsers((err, results) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Database error", details: err.message }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
        });
    }

    // Get UMKM info by user ID (support multiple records)
    else if (req.method === "GET" && req.url.startsWith("/api/umkm/")) {
      const id = req.url.split("/")[3];
      try {
        const [rows] = await koneksi.query("SELECT * FROM umkm WHERE user_id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows)); // return ALL records
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    }

    // Add UMKM info by user ID
    else if (req.method === "POST" && req.url.startsWith("/api/umkm/add/")) {
        const userId = req.url.split("/")[4];
        let body = "";

        req.on("data", chunk => (body += chunk));
        req.on("end", async () => {
            try {
            const { business_name, business_desc, location, owner, category, revenue } = JSON.parse(body);

            await koneksi.query(
                "INSERT INTO umkm (user_id, business_name, business_desc, location, owner, category, revenue) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [userId, business_name, business_desc, location, owner, category, revenue]
            );

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "UMKM added successfully" }));
            } catch (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            }
        });
        }

    // Update UMKM info by user ID
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

    // Get Investor info by user ID (support multiple records)
    else if (req.method === "GET" && req.url.startsWith("/api/investor/")) {
      const id = req.url.split("/")[3];
      try {
        const [rows] = await koneksi.query("SELECT * FROM investor WHERE user_id = ?", [id]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows)); // return ALL records
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    }

    // Getting all Investor users for admin
    else if (req.method === "GET" && req.url === "/api/investorusers") {
        tampilInvestorUsers((err, results) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Database error", details: err.message }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
        });
    }   
    
    // Update Investor info by user ID (exclude the "add" route)
    else if (req.method === "POST" && req.url.startsWith("/api/investor/") && !req.url.startsWith("/api/investor/add/")) {
      const id = req.url.split("/")[3];
      let body = "";

      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const { company_name, investment_focus, capital, investment_date } = JSON.parse(body);

          // NOTE: removed the extra comma before WHERE
          await koneksi.query(
            "UPDATE investor SET company_name=?, investment_focus=?, capital=?, investment_date=? WHERE user_id=?",
            [company_name, investment_focus, capital, investment_date, id]
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Investor info updated successfully" }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }


    // Add Investor info by user ID
    else if (req.method === "POST" && req.url.startsWith("/api/investor/add/")) {
      const userId = req.url.split("/")[4];
      let body = "";

      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const { company_name, investment_focus, capital, investment_date } = JSON.parse(body);

          await koneksi.query(
            "INSERT INTO investor (user_id, company_name, investment_focus, capital, investment_date) VALUES (?, ?, ?, ?, ?)",
            [userId, company_name, investment_focus, capital, investment_date]
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Investor added successfully" }));
        } catch (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }

    // Add new user for add-user.html
    else if (req.method === "POST" && req.url === "/api/adduser") {
      let body = "";

      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const { username, email, password, role } = JSON.parse(body);

          if (!username || !email || !password || !role) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Missing required fields" }));
          }

          const [result] = await koneksi.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, password, role]
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User added successfully", id: result.insertId }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }


    else if (req.method === "GET" && req.url.startsWith("/edit.html")) {
    fs.readFile(path.join(__dirname, 'frontend', 'edit.html'), (err, html) => {
        if (err) {
        res.writeHead(404);
        return res.end('File not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
    }

else if (req.method === "GET" && req.url === "/api/data") {
  const dataPath = path.join(__dirname, "backend", "data.json");
  fs.readFile(dataPath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Data not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  });
}



  // CSS Files
  else if (req.method === "GET" && req.url.endsWith(".css")) {
    const cssPath = path.join(__dirname, 'frontend', req.url);
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
  const cleanPath = req.url.split("?")[0]; 
  const htmlPath = path.join(__dirname, "frontend", cleanPath);

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
    const jsPath = path.join(__dirname, 'frontend', req.url);
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

if (require.main === module) {
  const http = require('http');
  const PORT = 3000;

  const server = http.createServer((req, res) => {
    module.exports(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
