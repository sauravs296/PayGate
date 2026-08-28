"use server";
import { getSession } from "@/lib/auth/session";
import { createApi, updateApi, deactivateApi } from "@/lib/db/apis";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setRouteOnChain } from "@/lib/stellar/soroban";

export async function createApiAction(formData: FormData) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const targetUrl = formData.get("targetUrl") as string;
  const priceUsdc = parseFloat(formData.get("priceUsdc") as string);
  const isListed = false;

  if (!name || !slug || !targetUrl || isNaN(priceUsdc)) {
    throw new Error("Missing required fields");
  }

  const api = await createApi({
    developerId: session.developerId,
    name,
    slug,
    description,
    targetUrl,
    priceUsdc,
    isListed,
  });

  // Configure the routing on-chain for the API
  await setRouteOnChain({
    apiId: api.id,
    developerWallet: session.developerId,
    shareBps: 9000, // 90% goes to developer
  });

  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath("/marketplace");
  redirect(`/apis/${api.id}?created=1`);
}

export async function updateApiAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const targetUrl = formData.get("targetUrl") as string;
  const priceUsdc = parseFloat(formData.get("priceUsdc") as string);
  const isActive = formData.get("isActive") === "on";

  await updateApi(id, session.developerId, {
    name,
    description,
    targetUrl,
    priceUsdc,
    isActive
  });

  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath(`/apis/${id}`);
  revalidatePath("/marketplace");
}

export async function deactivateApiAction(id: string) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  await deactivateApi(id, session.developerId);

  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath(`/apis/${id}`);
  revalidatePath("/marketplace");
  redirect("/apis?deleted=1");
}
