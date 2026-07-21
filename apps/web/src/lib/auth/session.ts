import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  developerId: string;
  stellarWallet: string;
  isLoggedIn: boolean;
};

export const defaultSession: SessionData = {
  developerId: "",
  stellarWallet: "",
  isLoggedIn: false,
};

const sessionOptions = {
  // In production, this should be a strong random string set in .env
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "paygate_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  
  return session;
}

