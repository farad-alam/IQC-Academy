const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const superAdmins = await prisma.user.findMany({
    where: { role: 'SUPER_ADMIN' },
    select: { email: true, name: true }
  });
  console.log(JSON.stringify(superAdmins, null, 2));
}

main().finally(() => prisma.$disconnect());
