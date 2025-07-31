import * as fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgPath = path.resolve(__dirname, "../../../src/public/img/");

const files = await fs.readdir(imgPath);

// перевод изображения в base64
export const getImgBuffer = async (data) => {
    try {
        if (data.at(0) === "i") {
            const fullPath = path.join(imgPath, `${data}.jpeg`);
            if ((await fs.stat(fullPath)).isFile()) {
                return (await fs.readFile(fullPath)).toString("base64");
            }
        }
        return data;
    } catch (e) {
        if (e.code === "ENOENT") {
            return data;
        }
        throw e;
    }
};
