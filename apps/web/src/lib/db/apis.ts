// src/lib/db/apis.ts
// Query helpers for the Api table.
// Every dashboard CRUD operation and every paywall route lookup goes through here.

import { prisma } from "@/lib/prisma";
import type { Api } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateApiInput = {
  developerId: string;
  slug: string;
  name: string;
  description?: string;
  targetUrl: string;
  priceUsdc: number;
  isListed?: boolean;
};

export type UpdateApiInput = Partial<
  Omit<CreateApiInput, "developerId" | "slug">
> & { isActive?: boolean };

export type ApiWithStats = Api & {
  _count: { calls: number };
};

// ─── Reads ────────────────────────────────────────────────────────────────────

/**
 * Look up an active API by its slug.
 * This is the hot path — called on every /api/x/[slug] request.
 */
export async function getActiveApiBySlug(slug: string): Promise<Api | null> {
  return prisma.api.findUnique({
    where: { slug, isActive: true },
  });
}

/**
 * Get all APIs owned by a developer, ordered newest first.
 * Used by the dashboard API list page.
 */
export async function getApisByDeveloper(
  developerId: string
): Promise<ApiWithStats[]> {
  return prisma.api.findMany({
    where: { developerId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { calls: true } } },
  });
}

/**
 * Get a single API by ID, scoped to the owning developer.
 * Scoping prevents one developer from reading another's data.
 */
export async function getApiById(
  id: string,
  developerId: string
): Promise<Api | null> {
  return prisma.api.findFirst({
    where: { id, developerId },
  });
}

/**
 * Get all publicly listed and active APIs for the /marketplace page.
 */
export async function getListedApis(): Promise<
  Pick<Api, "slug" | "name" | "description" | "priceUsdc" | "createdAt">[]
> {
  return prisma.api.findMany({
    where: { isListed: true, isActive: true },
    select: {
      slug: true,
      name: true,
      description: true,
      priceUsdc: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Register a new paywalled API. Called from the dashboard "Add API" form.
 */
export async function createApi(input: CreateApiInput): Promise<Api> {
  return prisma.api.create({
    data: {
      developerId: input.developerId,
      slug: input.slug,
      name: input.name,
      description: input.description,
      targetUrl: input.targetUrl,
      priceUsdc: input.priceUsdc,
      isListed: input.isListed ?? false,
    },
  });
}

/**
 * Update fields on an existing API. Only the owning developer can do this.
 */
export async function updateApi(
  id: string,
  developerId: string,
  input: UpdateApiInput
): Promise<Api> {
  return prisma.api.update({
    where: { id, developerId },
    data: input,
  });
}

/**
 * Soft-delete: mark an API as inactive so it returns 404 at the paywall
 * but its ApiCall history is preserved for earnings reporting.
 */
export async function deactivateApi(
  id: string,
  developerId: string
): Promise<Api> {
  return prisma.api.update({
    where: { id, developerId },
    data: { isActive: false },
  });
}

