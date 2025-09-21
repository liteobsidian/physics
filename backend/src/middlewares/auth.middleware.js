import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function createAuthTokens(id, username, role) {
    const refreshToken = jwt.sign({ id, username, role }, process.env.REFRESH_SECRET, { expiresIn: "30d" });
    const accessToken = jwt.sign({ id, username, role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    return { refreshToken, accessToken };
}

export async function updateTokens(req, res, next) {
    const accessCookie = req.cookies["access_token"];
    const refreshCookie = req.cookies["refresh_token"];

    if (!refreshCookie) {
        res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: "strict" });
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (accessCookie) {
        return jwt.verify(accessCookie, process.env.ACCESS_SECRET, (err, accessData) => {
            if (!err && accessData?.id) {
                req.id = accessData.id;
                return next();
            }

            if (err?.name === "TokenExpiredError" || !accessCookie) {
                verifyAndRefreshTokens(refreshCookie, req, res, next);
            } else {
                return res.status(401).json({ message: "Invalid token" });
            }
        });
    }

    verifyAndRefreshTokens(refreshCookie, req, res, next);
}

export async function verifyAndRefreshTokens(refresh_token, req, res, next) {
    jwt.verify(refresh_token, process.env.REFRESH_SECRET, async (err, refreshData) => {
        if (err && err?.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Unauthorized",
                clearTokens: true,
            });
        }

        if (!refreshData?.id) {
            return res.status(401).json({
                message: "Invalid token",
                clearTokens: true,
            });
        }

        const tokens = await createAuthTokens(refreshData.id, refreshData.username, refreshData.role);

        res.cookie("access_token", tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        req.id = refreshData.id;
        return next();
    });
}
