import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

const SPOTIFY_SCOPES = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private",
    "user-read-email",
].join(" ");

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const params = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
        });

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64"),
            },
            body: params.toString(),
        });

        const refreshed = await response.json();

        if (!response.ok) throw refreshed;

        return {
            ...token,
            accessToken: refreshed.access_token,
            // Spotify may or may not return a new refresh token
            refreshToken: refreshed.refresh_token ?? token.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
        };
    } catch (err) {
        console.error("[auth] Failed to refresh Spotify token:", err);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    scope: SPOTIFY_SCOPES,
                    show_dialog: true
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign-in — store tokens
            if (account) {
                console.log("[auth] New sign-in account details:", {
                    provider: account.provider,
                    scope: account.scope,
                    expires_at: account.expires_at
                });
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at,
                };
            }

            // Token still valid
            if (Date.now() / 1000 < (token.expiresAt as number) - 60) {
                return token;
            }

            // Token expired — refresh it
            console.log("[auth] Access token expired, refreshing...");
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            (session as { accessToken?: string }).accessToken =
                token.accessToken as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
