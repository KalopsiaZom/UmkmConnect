const querystring = require('querystring');
const conn = require('./koneksi');

const simpanBarang = (req, res) => {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {
        const formData = querystring.parse(data);

        const sql = "INSERT INTO ms_barang (nama_barang, jumlah, kategori, kondisi, lokasi) VALUES (?, ?, ?, ?, ?)";
        conn.query(sql, [formData.nama_barang, formData.jumlah, formData.kategori, formData.kondisi, formData.lokasi], (err) => {
            if (err){
                res.write("Gagal simpan");
                res.end();
            } else {
                res.writeHead(302, { 'Location': '/' });
                res.end();
            }
        });
    });
};

module.exports = simpanBarang;