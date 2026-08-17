const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  // Find all existing ADMIN users
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  console.log(`Found ${admins.length} ADMIN account(s).`);

  if (admins.length === 0) {
    console.log('No admins to promote.');
    return;
  }

  // Promote all existing ADMINs to SUPER_ADMIN
  const result = await prisma.user.updateMany({
    where: { role: 'ADMIN' },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log(`✅ Promoted ${result.count} ADMIN(s) to SUPER_ADMIN:`);
  admins.forEach(a => console.log(`   - ${a.name} (${a.email})`));
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
