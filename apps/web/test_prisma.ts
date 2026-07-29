import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const apis = await prisma.api.findMany()
  console.log("All APIs:", apis.map(a => ({ name: a.name, slug: a.slug })))
}

main().catch(console.error).finally(() => prisma.$disconnect())
