const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Finding courses assigned to batches...');
  const batchCourses = await prisma.batchCourse.findMany({
    select: { courseId: true }
  });

  const courseIds = [...new Set(batchCourses.map(bc => bc.courseId))];
  
  if (courseIds.length === 0) {
    console.log('No batch courses found.');
    return;
  }

  console.log(`Found ${courseIds.length} unique courses assigned to batches. Updating...`);

  const updateResult = await prisma.course.updateMany({
    where: {
      id: { in: courseIds }
    },
    data: {
      isBatchCourse: true
    }
  });

  console.log(`Updated ${updateResult.count} courses to isBatchCourse = true.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
