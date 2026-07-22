"use server";

import { getSession } from "@/lib/auth/session";
import { createApi, updateApi } from "@/lib/db/apis";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createApiAction(formData: FormData) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const targetUrl = formData.get("targetUrl") as string;
  const priceUsdc = parseFloat(formData.get("priceUsdc") as string);
  const isListed = formData.get("isListed") === "on";

  if (!name || !slug || !targetUrl || isNaN(priceUsdc)) {
    throw new Error("Missing required fields");
  }

  await createApi({
    developerId: session.developerId,
    name,
    slug,
    description,
    targetUrl,
    priceUsdc,
    isListed,
  });

  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath("/marketplace");
  redirect("/apis");
}

export async function updateApiAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const targetUrl = formData.get("targetUrl") as string;
  const priceUsdc = parseFloat(formData.get("priceUsdc") as string);
  const isListed = formData.get("isListed") === "on";
  const isActive = formData.get("isActive") === "on";

  await updateApi(id, session.developerId, {
    name,
    description,
    targetUrl,
    priceUsdc,
    isListed,
    isActive
  });

  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath(`/apis/${id}`);
  revalidatePath("/marketplace");
  redirect(`/apis`);
}

