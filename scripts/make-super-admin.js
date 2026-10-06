/**
 * ONE-TIME ROLE UPGRADE SCRIPT — SAFE FOR PRODUCTION
 *
 * This script ONLY updates the `role` field of a single user row.
 * It does NOT delete, create, or cascade anything.
 *
 * Run once:
 *   node scripts/make-super-admin.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TARGET_EMAIL = 'sarthik753@gmail.com';

async function main() {
  console.log('─────────────────────────────────────────────');
  console.log('  IQC Academy — SUPER_ADMIN Role Upgrade');
  console.log('─────────────────────────────────────────────');

  // Step 1: Look up the user — READ ONLY, nothing changes here
  const existing = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      // passwordHash intentionally excluded from logs
    },
  });

  if (!existing) {
    console.error(`\n❌ User not found: ${TARGET_EMAIL}`);
    console.error('   Make sure the email is correct and the user has registered.');
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log('\n📋 Current user record:');
  console.log(`   Name:   ${existing.name}`);
  console.log(`   Email:  ${existing.email}`);
  console.log(`   Role:   ${existing.role}`);
  console.log(`   Status: ${existing.status}`);

  // Step 2: Already a SUPER_ADMIN? No need to do anything
  if (existing.role === 'SUPER_ADMIN') {
    console.log('\n⚠️  User is already SUPER_ADMIN. No changes made.');
    await prisma.$disconnect();
    return;
  }

  // Step 3: UPDATE — only the `role` field, nothing else
  //         No deletes. No creates. No cascades.
  const updated = await prisma.user.update({
    where: { email: TARGET_EMAIL },
    data: {
      role: 'SUPER_ADMIN',
      // Password, name, mobile, enrollments, etc. — all untouched
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log('\n✅ Role updated successfully!');
  console.log('─────────────────────────────────────────────');
  console.log(`   Name:   ${updated.name}`);
  console.log(`   Email:  ${updated.email}`);
  console.log(`   Role:   ${updated.role}   ← changed`);
  console.log(`   Status: ${updated.status}`);
  console.log('─────────────────────────────────────────────');
  console.log('\n🔒 Login at: /admin/login');
  console.log('   Password is unchanged.\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('\n❌ Script failed:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
