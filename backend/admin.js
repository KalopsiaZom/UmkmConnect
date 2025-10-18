// /lib/admin.js
import { conn } from "./koneksi.js";

export async function tampilUsers() {
  const [rows] = await conn.execute("SELECT * FROM users");
  return rows;
}
