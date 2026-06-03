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
exports.OTPService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../users/user.model");
const appError_1 = __importDefault(require("../../errorHerplrs/appError"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User Not  Found");
    }
    if (user.IsVerified) {
        throw new appError_1.default(401, "You are already verified");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    if (user.IsVerified) {
        throw new appError_1.default(401, "You are already verified");
    }
    const redisKey = `otp:${email}`;
    const saveOTP = yield redis_config_1.redisClient.get(redisKey);
    if (!saveOTP) {
        throw new appError_1.default(401, "Invalid OTP");
    }
    if (saveOTP !== otp) {
        throw new appError_1.default(401, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { IsVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del([redisKey])
    ]);
});
exports.OTPService = {
    sendOTP,
    verifyOTP
};
