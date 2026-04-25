// auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(token) {
  if (!token) throw new Error("UNAUTHORIZED");

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("FORBIDDEN");
  }
}
