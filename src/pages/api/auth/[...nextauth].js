import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        const newUser = await User.create({
                            id: user.id || Date.now().toString(),
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: 'user',
                            createdAt: new Date(),
                            // Password is not required for google auth users
                        });
                        return true;
                    }
                    return true;
                } catch (error) {
                    console.error("Error checking/creating user", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // Fetch the user from DB to get the role if needed, or just pass basic info
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
