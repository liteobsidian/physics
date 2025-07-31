import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function createAuthTokens(id, username) {
    const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_SECRET, { expiresIn: "30d" });
    const accessToken = jwt.sign({ id, username }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    return { refreshToken, accessToken };
}

export function authMiddleware(req, res, next) {
    const accessCookie = req.cookies["access_token"];

    if (!accessCookie) {
        return res.status(401).json({ message: "Токен отсутстувует" });
    }

    jwt.verify(access_token, process.env.ACCESS_SECRET, (err, accessData) => {
        console.log("Даныне из токена", accessData);

        if (err || !accessData?.id) {
            return res.status(401).json({ message: "Неверный токен" });
        }

        req.id = accessData.id;
        next();
    });
}

export function updateTokens(req, res, next) {
    const accessCookie = req.cookies["access_token"];
    const refreshCookie = req.cookies["refresh_token"];

    if (!accessCookie || !refreshCookie) {
        return res.status(403).json({ message: "Токены отсутствуют" });
    }

    jwt.verify(accessCookie, process.env.ACCESS_SECRET, (err, accessData) => {
        if (!err) {
            req.id = accessData.id;
            return next();
        }

        if (err && err.name === "TokenExpiredError") {
            jwt.verify(refreshCookie, process.env.REFRESH_SECRET, async (err, refreshData) => {
                if (err && err.name === "TokenExpiredError") {
                    console.log("Refresh токен не действителен!");
                    return res.status(403).json({
                        message: "Refresh-токен истёк. Авторизуйтесь снова.",
                        clearTokens: true,
                    });
                } else if (err) {
                    return res.status(403).json({
                        message: "Ошибка верификации refresh-токена.",
                    });
                }

                const tokens = await createAuthTokens(refreshData.id, refreshData.username);

                res.cookie("access_token", tokens.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refresh_token", tokens.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({ message: "Токены обновлены" });
            });
        } else {
            return res.status(403).json({ message: "Ошибка верификации токенов" });
        }
    });
}
