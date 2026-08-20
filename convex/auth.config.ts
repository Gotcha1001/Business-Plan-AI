// convex/auth.config.ts
const authConfig = {
  providers: [
    {
      domain: "https://healthy-wasp-9813.clerk.accounts.dev",
      applicationID: "convex", // ← must be "convex", not a dynamic env var
    },
  ],
};

export default authConfig;
