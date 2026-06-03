"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorHerplrs/appError"));
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../users/user.interface");
const user_model_1 = require("../users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const bcrypt_2 = __importDefault(require("bcrypt"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new appError_1.default(400, "email dose not  exist");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new appError_1.default(400, " incorrect password");
    }
    const _a = isUserExist.toObject(), { password: pass } = _a, res = __rest(_a, ["password"]);
    const userTokens = (0, userTokens_1.createUserToken)(isUserExist);
    delete isUserExist.password;
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: res
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.userId) {
        throw new appError_1.default(401, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new appError_1.default(404, "user  not  found");
    }
    const hashedPassword = yield bcrypt_2.default.hash(payload.newPassword, Number(env_1.envVers.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "user  not  found");
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "you have already set password, Now  you Your Profile and changed the password");
    }
    const hashedPassword = yield bcrypt_2.default.hash(plainPassword, Number(env_1.envVers.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerID: user.email
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    yield user.save();
    return {};
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_2.default.BAD_REQUEST, "User does not exist");
    }
    if (!isUserExist.IsVerified) {
        throw new appError_1.default(http_status_codes_2.default.BAD_REQUEST, "User is not verified");
    }
    if (isUserExist.IsActive === user_interface_1.isActive.BLOCKED || isUserExist.IsActive === user_interface_1.isActive.INACTIVE) {
        throw new appError_1.default(http_status_codes_2.default.BAD_REQUEST, `User is ${isUserExist.IsActive}`);
    }
    if (isUserExist.IsDeleted) {
        throw new appError_1.default(http_status_codes_2.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVers.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVers.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    });
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcrypt_2.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "old  password  does  not match");
    }
    user.password = yield bcrypt_2.default.hash(newPassword, Number(env_1.envVers.BCRYPT_SALT_ROUND));
    yield user.save();
});
exports.authService = {
    credentialsLogin,
    getNewAccessToken,
    setPassword,
    changePassword,
    resetPassword,
    forgotPassword
};
