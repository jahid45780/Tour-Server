"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, tokenInfo) => {
    const cookieOptions = {
        httpOnly: true,
        secure: env_1.envVers.NODE_ENV === "production",
        sameSite: env_1.envVers.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    };
    if (tokenInfo.accessToken) {
        res.cookie("AccessToken", tokenInfo.accessToken, Object.assign({}, cookieOptions));
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, Object.assign({}, cookieOptions));
    }
};
exports.setAuthCookie = setAuthCookie;
