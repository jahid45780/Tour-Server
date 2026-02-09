import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    USER = "USER",
    GUIDE = "GUIDE",
    includes = "includes"
}

export interface IAuthProvider {
    provider:string;
    providerID:string
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?:Types.ObjectId;
    name:string;
    email:string;
    password?:string;
    phone?:string;
    picture?:string;
    address?:string;
    IsDeleted?:boolean;
    IsVerified:boolean;
    IsActive?:isActive;
    role: Role;
    auths:IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?:Types.ObjectId[]
}