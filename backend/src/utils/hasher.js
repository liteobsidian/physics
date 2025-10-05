import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function hasher(num) {
    return bcrypt.hash(num, Number(process.env.SALT_ROUND));
}

export function isPasswordMatch(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
