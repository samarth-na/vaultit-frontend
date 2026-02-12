import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export type Session = typeof authClient.$Infer.Session;

export const signUp = async ({
  email,
  password,
  name,
  callbackURL = "/",
}: {
  email: string;
  password: string;
  name: string;
  callbackURL?: string;
}) => {
  return authClient.signUp.email({
    email,
    password,
    name,
    callbackURL,
  });
};

export const signIn = async ({
  email,
  password,
  rememberMe = false,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) => {
  return authClient.signIn.email({
    email,
    password,
    rememberMe,
  });
};

export const signOut = async () => {
  return authClient.signOut();
};

export const getSession = async () => {
  return authClient.getSession();
};

export const useSession = authClient.useSession;
