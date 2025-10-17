const conn = require("./koneksi");

const hapusBarang = (req, res, id) => {
    console.log("Menghapus barang dengan ID:", id);

    const sql = "DELETE FROM ms_barang WHERE id_barang = ?";
    conn.query(sql, [id], (err) => {
        if (err) {
            res.write("Gagal hapus");
            res.end();
        } else {
            res.writeHead(302, { 'Location': '/' });
            res.end();
        }
    });
}

module.exports = hapusBarang;