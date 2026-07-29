const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const apis = await prisma.api.findMany({ select: { slug: true } });
  console.log(apis);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
