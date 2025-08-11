import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function hashPassword(password) {
    return bcrypt.hash(password, Number(process.env.SALT_ROUND));
}

export function isPasswordMatch(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
