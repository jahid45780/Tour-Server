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
exports.checkAuth = ((...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new appError_1.default(403, "Not received token");
        }
        // const verifiedToken = jwt.verify(accessToken,"SECRET")
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVers.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new appError_1.default(400, "user dose not  exist");
        }
        if (isUserExist.IsActive === user_interface_1.isActive.BLOCKED || isUserExist.IsActive === user_interface_1.isActive.INACTIVE) {
            throw new appError_1.default(400, `user is ${isUserExist.IsActive}`);
        }
        if (isUserExist.IsDeleted) {
            throw new appError_1.default(400, "user is deleted");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new appError_1.default(403, "you not permitted to view this  route");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
}));
