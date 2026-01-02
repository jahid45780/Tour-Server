import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
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
    name:string;
    email:string;
    password?:string;
    phone?:string;
    picture?:string;
    address?:string;
    IsDeleted?:string;
    IsVerified:boolean;
    IsActive?:isActive;
    role: Role;
    auths:IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?:Types.ObjectId[]
}