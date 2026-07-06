/**
 * ONE-TIME ADMIN SEED SCRIPT
 * 
 * Run this ONCE to create your first admin account:
 *   node prisma/seed-admin.js
 * 
 * Then delete this file or don't commit it.
 */

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  // ─── CONFIGURE YOUR ADMIN CREDENTIALS HERE ────────────────────────────────
  const ADMIN_NAME     = 'Super Admin';
  const ADMIN_EMAIL    = 'admin@iqcacademy.com';
  const ADMIN_MOBILE   = '01700000000';
  const ADMIN_PASSWORD = 'Admin@12345';
  // ──────────────────────────────────────────────────────────────────────────

  // Check if already exists
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`\n⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
    console.log('   If you want to reset the password, delete the user first.');
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await argon2.hash(ADMIN_PASSWORD);

  const admin = await prisma.user.create({
    data: {
      name:         ADMIN_NAME,
      email:        ADMIN_EMAIL,
      mobile:       ADMIN_MOBILE,
      passwordHash,
      role:         'ADMIN',
      status:       'ACTIVE',
    }
  });

  console.log('\n✅ Admin account created successfully!');
  console.log('─────────────────────────────────────');
  console.log(`   Name:     ${admin.name}`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role:     ${admin.role}`);
  console.log('─────────────────────────────────────');
  console.log('\n🔒 Login at: /admin/login');
  console.log('⚠️  Please change your password after first login!\n');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('\n❌ Seed failed:', e.message);
  process.exit(1);
});
