const pool = require('./koneksi');
const querystring = require('querystring');

const simpanBarang = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const data = querystring.parse(body);
            const sql = `
                INSERT INTO ms_barang (nama_barang, jumlah, kategori, kondisi, lokasi)
                VALUES (?, ?, ?, ?, ?)
            `;

            await pool.query(sql, [
                data.nama_barang,
                data.jumlah,
                data.kategori,
                data.kondisi,
                data.lokasi
            ]);

            res.writeHead(302, { Location: '/' });
            res.end();
        });
    } catch (err) {
        console.error("Insert error:", err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database insert error');
    }
};

module.exports = simpanBarang;
