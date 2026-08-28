"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateProfileState = {
  success: boolean;
  message: string;
} | null;

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.stellarWallet) {
    return { success: false, message: "Not authenticated." };
  }

  const email = (formData.get("email") as string | null)?.trim() || null;
  const name = (formData.get("name") as string | null)?.trim() || null;
  const bio = (formData.get("bio") as string | null)?.trim() || null;
  const twitter = (formData.get("twitter") as string | null)?.trim() || null;
  const github = (formData.get("github") as string | null)?.trim() || null;

  // Basic email validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    await prisma.developer.update({
      where: { stellarWallet: session.stellarWallet },
      data: {
        email,
        name,
        bio,
        twitter,
        github,
      },
    });

    revalidatePath("/settings");
    return { success: true, message: "Profile saved successfully!" };
  } catch {
    return { success: false, message: "Failed to save profile. Please try again." };
  }
}
