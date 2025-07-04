import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Estende as interfaces existentes do NextAuth
declare module "next-auth" {
    interface User extends DefaultUser {
        abrangencia?: {
            id: string;
            nome: string;
            descricao: string;
            nivel: number;
        };
    }

    interface Session extends DefaultSession {
        user: {
            abrangencia?: {
                id: string;
                nome: string;
                descricao: string;
                nivel: number;
            };
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        abrangencia?: {
            id: string;
            nome: string;
            descricao: string;
            nivel: number;
        };
    }
}
