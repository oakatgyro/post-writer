import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {db} from './db'

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        })
    ],
    adapter: PrismaAdapter(db),
    pages: {
        signIn: '/login',
    },
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                return { ...token, id: user.id}
            }

            return token
        },

        async session({ token, session }) {
            if(token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    }
}

