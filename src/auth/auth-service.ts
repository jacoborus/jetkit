import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import db from "@/db/db";
import config from "@/config";
import mailSend from "@/mailer/mailer-service";

export default betterAuth({
  trustedOrigins: [config.BASE_URL],
  basePath: "/auth",

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [
    admin({
      defaultRole: "regular",
      adminRoles: ["admin", "superadmin"],
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await mailSend({
        to: user.email,
        subject: "Reset your password",
        body: {
          text: `Click the link to reset your password: ${url}`,
          html: `Click the link to reset your password: ${url}`,
        },
      });
    },
    // disableSignUp: true,
  },

  emailVerification: {
    // sendOnSignUp: true, // automatically send a verification email at signup
    sendVerificationEmail: async ({ user, url, token }) => {
      await mailSend({
        to: user.email,
        subject: "Verify your email address",
        body: {
          text: `Click the link to verify your email: ${url} \n token: ${token}`,
          html: `Click the link to verify your email: ${url} \n token: ${token}`,
        },
      });
    },
  },

  advanced: {
    database: {
      generateId: false,
    },

    crossSubDomainCookies: {
      enabled: true,
    },

    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
});
