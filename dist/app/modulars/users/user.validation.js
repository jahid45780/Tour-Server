"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional()
});
exports.UpdateUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }).optional(),
    //  password: z
    //  .string({ invalid_type_error: "Password must be string" })
    //  .min(8, { message: "Password must be at least 8 characters long." })
    //  .regex(/^(?=.*[A-Z])/, {
    //   message: "Password must contain at least 1 uppercase letter.",
    //   })
    //  .regex(/^(?=.*[!@#$%^&*])/, {
    //  message: "Password must contain at least 1 special character.",
    //  }) 
    //  .regex(/^(?=.*\d)/, {
    //  message: "Password must contain at least 1 number.",
    //  }).optional(),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
    role: zod_1.z
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    isActive: zod_1.z
        .enum(Object.values(user_interface_1.isActive))
        .optional(),
    IsDeleted: zod_1.z
        .string({ invalid_type_error: "isDelete must be true or false" })
        .optional(),
    IsVerified: zod_1.z
        .string({ invalid_type_error: "isVerified must be true or false" })
        .optional()
});
