import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function genCode() {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    return bcrypt.hash(code, process.env.SALT_ROUND);
}
