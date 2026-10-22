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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const appError_1 = __importDefault(require("../../errorHerplrs/appError"));
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const user_model_1 = require("../users/user.model");
const user_interface_1 = require("../users/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorization = req.headers.authorization;
        const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.AccessToken) ||
            ((authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer "))
                ? authorization.split(" ")[1]
                : authorization);
        console.log("Cookie names:", Object.keys(req.cookies || {}));
        console.log("Authorization:", !!req.headers.authorization);
        if (!accessToken) {
            throw new appError_1.default(401, "Authentication token missing");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVers.JWT_ACCESS_SECRET);
        if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.email) || !(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
            throw new appError_1.default(401, "Invalid authentication token");
        }
        const user = yield user_model_1.User.findOne({
            email: verifiedToken.email,
        });
        if (!user) {
            throw new appError_1.default(401, "User does not exist");
        }
        if (user.IsActive === user_interface_1.isActive.BLOCKED ||
            user.IsActive === user_interface_1.isActive.INACTIVE) {
            throw new appError_1.default(403, `User is ${user.IsActive}`);
        }
        if (user.IsDeleted) {
            throw new appError_1.default(403, "User is deleted");
        }
        if (authRoles.length > 0 &&
            !authRoles.includes(String(verifiedToken.role))) {
            throw new appError_1.default(403, "You are not permitted to access this route");
        }
        req.user = verifiedToken;
        return next();
    }
    catch (error) {
        return next(error);
    }
});
exports.checkAuth = checkAuth;
