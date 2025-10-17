const conn = require("./koneksi");

const tampilBarang = (res) => {
    const sql = "SELECT * FROM ms_barang";

    conn.query(sql, (err, results) => {
        if (err) {
            res.write("Error query");
        } else {
            res.write("<h2>Daftar Barang</h2>");
            res.write("<table border='1'>");
            res.write("<tr>");
            res.write("<th>ID</th>");
            res.write("<th>Nama</th>");
            res.write("<th>Jumlah</th>");
            res.write("<th>Kategori</th>");
            res.write("<th>Kondisi</th>");
            res.write("<th>Lokasi</th>");
            res.write(`<th colspan="2">Aksi</th>`);
            res.write("</tr>");

            results.forEach((barang) => {
                res.write("<tr>");
                res.write(`<td>${barang.id_barang}</td>`);
                res.write(`<td>${barang.nama_barang}</td>`);
                res.write(`<td>${barang.jumlah}</td>`);
                res.write(`<td>${barang.kategori}</td>`);
                res.write(`<td>${barang.kondisi}</td>`);
                res.write(`<td>${barang.lokasi}</td>`);
                res.write(`<td><a href="/delete/${barang.id_barang}">Hapus</a></td>`);
                res.write(`<td><a href="/edit/${barang.id_barang}">Edit</a></td>`);
                res.write("</tr>");
            });

            res.write("</table>");
            res.end();
        }
        
    });
}

module.exports = tampilBarang;