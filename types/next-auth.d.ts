import { User } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
    interface JWT {
        id: UserID;
    }
}

declare module "next-auth" {
    interface Session {
        user: User & { 
            id: UserId;
        }
    }
}