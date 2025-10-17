const pool = require('./koneksi');

const hapusBarang = async (res, id) => {
    try {
        const sql = "DELETE FROM ms_barang WHERE id_barang = ?";
        await pool.query(sql, [id]);

        res.writeHead(302, { Location: '/' });
        res.end();
    } catch (err) {
        console.error("Delete error:", err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database delete error');
    }
};

module.exports = hapusBarang;
