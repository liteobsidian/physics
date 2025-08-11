import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function createAuthTokens(id, username, role) {
    const refreshToken = jwt.sign({ id, username, role }, process.env.REFRESH_SECRET, { expiresIn: "30d" });
    const accessToken = jwt.sign({ id, username, role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    return { refreshToken, accessToken };
}

export function updateTokens(req, res, next) {
    const accessCookie = req.cookies["access_token"];
    const refreshCookie = req.cookies["refresh_token"];

    if (!refreshCookie) {
        return res.status(403).json({ message: "Авторизируйтесь снова" });
    }

    if (accessCookie) {
        return jwt.verify(accessCookie, process.env.ACCESS_SECRET, (err, accessData) => {
            if (!err && accessData?.id) {
                req.id = accessData.id;
                return next();
            }

            if (err?.name === "TokenExpiredError") {
                verifyAndRefreshTokens(refreshCookie, req, res, next);
            } else {
                return res.status(403).json({ message: "Неверный токен" });
            }
        });
    }

    verifyAndRefreshTokens(refreshCookie, req, res, next);
}

export function verifyAndRefreshTokens(refreshCookie, req, res, next) {
    jwt.verify(refreshCookie, process.env.REFRESH_SECRET, async (err, refreshData) => {
        if (err && err?.name === "TokenExpiredError") {
            return res.status(403).json({
                message: "Refresh-токен недействителен. Авторизируйтесь снова.",
                clearTokens: true,
            });
        }

        if (!refreshData?.id) {
            return res.status(403).json({
                message: "Некорректные данные в refresh-токене.",
                clearTokens: true,
            });
        }

        const tokens = await createAuthTokens(refreshData.id, refreshData.username, refreshData.role);

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

        req.id = refreshData.id;
        return next();
    });
}
