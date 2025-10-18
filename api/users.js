// /api/users.js
import { tampilUsers } from "../backend/admin";

export default async function handler(req, res) {
  try {
    const users = await tampilUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
