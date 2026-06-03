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
exports.seedSupperAdmin = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modulars/users/user.interface");
const user_model_1 = require("../modulars/users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedSupperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: env_1.envVers.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("super Admin already exists");
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(env_1.envVers.SUPER_ADMIN_PASSWORD, Number(env_1.envVers.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerID: env_1.envVers.SUPER_ADMIN_EMAIL
        };
        const payload = {
            name: "super_admin",
            role: user_interface_1.Role.SUPER_ADMIN,
            email: env_1.envVers.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            IsVerified: true,
            auths: [authProvider]
        };
        const superAdmin = yield user_model_1.User.create(payload);
        console.log("successfully create super admin");
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSupperAdmin = seedSupperAdmin;
