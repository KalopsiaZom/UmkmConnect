const conn = require('./koneksi');
const querystring = require('querystring');

async function editData(req, res, id) {
    try {
        const [results] = await conn.query('SELECT * FROM ms_barang WHERE id_barang = ?', [id]);

        if (results.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Data not found');
        }

        const item = results[0];
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Edit Barang</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h2>Edit Barang</h2>
                <form method="post" action="/update">
                    <input type="hidden" name="id_barang" value="${item.id_barang}">
                    <label for="nama">Nama Barang:</label><br>
                    <input type="text" id="nama" name="nama_barang" value="${item.nama_barang}" required><br><br>

                    <label for="jumlah">Jumlah:</label><br>
                    <input type="number" id="jumlah" name="jumlah" value="${item.jumlah}" required><br><br>

                    <label for="kategori">Kategori:</label><br>
                    <select name="kategori" id="kategori">
                        <option value="Elektronik" ${item.kategori === "Elektronik" ? "selected" : ""}>Elektronik</option>
                        <option value="Furniture" ${item.kategori === "Furniture" ? "selected" : ""}>Furniture</option>
                        <option value="Alat Tulis" ${item.kategori === "Alat Tulis" ? "selected" : ""}>Alat Tulis</option>
                        <option value="Lainnya" ${item.kategori === "Lainnya" ? "selected" : ""}>Lainnya</option>
                    </select><br><br>

                    <label for="kondisi">Kondisi:</label><br>
                    <select id="kondisi" name="kondisi">
                        <option value="Baik" ${item.kondisi === "Baik" ? "selected" : ""}>Baik</option>
                        <option value="Rusak" ${item.kondisi === "Rusak" ? "selected" : ""}>Rusak</option>
                        <option value="Hilang" ${item.kondisi === "Hilang" ? "selected" : ""}>Hilang</option>
                    </select><br><br>

                    <label for="lokasi">Lokasi:</label>
                    <input type="text" id="lokasi" name="lokasi" value="${item.lokasi}" required><br><br>

                    <input type="submit" value="Update">
                </form>
            </body>
            </html>
        `);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error');
    }
}

async function updateBarang(req, res) {
    try {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));

        req.on('end', async () => {
            const formData = querystring.parse(body);
            const sql = `
                UPDATE ms_barang 
                SET nama_barang = ?, jumlah = ?, kategori = ?, kondisi = ?, lokasi = ?
                WHERE id_barang = ?
            `;

            await conn.query(sql, [
                formData.nama_barang,
                formData.jumlah,
                formData.kategori,
                formData.kondisi,
                formData.lokasi,
                formData.id_barang
            ]);

            res.writeHead(302, { Location: '/' });
            res.end();
        });
    } catch (err) {
        console.error("Update error:", err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database update error');
    }
}

module.exports = { editData, updateBarang };
