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
exports.createNewAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHerplrs/appError"));
const user_interface_1 = require("../modulars/users/user.interface");
const user_model_1 = require("../modulars/users/user.model");
const jwt_1 = require("./jwt");
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVers.JWT_ACCESS_SECRET, env_1.envVers.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVers.JWT_ACCESS_REFRESH_SECRET, env_1.envVers.JWT_ACCESS_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserToken = createUserToken;
const createNewAccessTokenWithRefreshToken = (refreshToke) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedrefreshToken = (0, jwt_1.verifyToken)(refreshToke, env_1.envVers.JWT_ACCESS_REFRESH_SECRET);
    const isUserExist = yield user_model_1.User.findOne({ email: verifiedrefreshToken.email });
    if (!isUserExist) {
        throw new appError_1.default(400, "user dose not  exist");
    }
    if (isUserExist.IsActive === user_interface_1.isActive.BLOCKED || isUserExist.IsActive === user_interface_1.isActive.INACTIVE) {
        throw new appError_1.default(400, `user is ${isUserExist.IsActive}`);
    }
    if (isUserExist.IsDeleted) {
        throw new appError_1.default(400, "user is deleted");
    }
    const userTokens = (0, exports.createUserToken)(isUserExist);
    return userTokens.accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
