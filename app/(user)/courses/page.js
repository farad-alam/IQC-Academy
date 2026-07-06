import prisma from '@/lib/db';
import Link from 'next/link';
import CourseCard from '@/components/features/CourseCard';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

export default async function CourseListPage({ searchParams }) {
  const filter = searchParams?.filter || 'all';
  const user = await getAuthUser();

  // Base query for PUBLISHED courses
  const where = { status: 'PUBLISHED' };
  if (filter === 'paid') {
    where.type = 'PAID';
  } else if (filter === 'free') {
    where.type = 'FREE';
  }

  // Fetch courses with their instructors and module counts
  const courses = await prisma.course.findMany({
    where,
    include: { 
      instructor: true,
      _count: { select: { modules: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch user enrollments if logged in
  let enrollments = [];
  if (user) {
    enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id }
    });
  }

  const displayCourses = filter === 'enrolled' 
    ? courses.filter(c => enrollments.some(e => e.courseId === c.id))
    : courses;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">কোর্সসমূহ</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          আপনার পছন্দমতো কোর্স নির্বাচন করে ধাপে ধাপে শেখা শুরু করুন।
        </p>
      </header>

      <div className="tabs" style={{ marginBottom: '2rem', maxWidth: '500px' }}>
        <Link href="/courses?filter=all" className={`tab ${filter === 'all' ? 'active' : ''}`}>
          সকল কোর্স
        </Link>
        <Link href="/courses?filter=enrolled" className={`tab ${filter === 'enrolled' ? 'active' : ''}`}>
          আমার কোর্স
        </Link>
        <Link href="/courses?filter=free" className={`tab ${filter === 'free' ? 'active' : ''}`}>
          ফ্রি কোর্স
        </Link>
        <Link href="/courses?filter=paid" className={`tab ${filter === 'paid' ? 'active' : ''}`}>
          প্রিমিয়াম
        </Link>
      </div>

      {displayCourses.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {displayCourses.map((course) => {
            const enrollment = enrollments.find(e => e.courseId === course.id);
            let status = course.type === 'PAID' ? 'locked' : 'available';
            if (enrollment) {
              status = enrollment.status === 'COMPLETED' ? 'completed' : 'enrolled';
            }
            
            const uiCourse = {
              id: course.id,
              title: course.title,
              description: course.description,
              level: course.level,
              duration: course.duration,
              type: course.type === 'PAID' ? 'paid' : 'free',
              price: course.price ? course.price.toString() : 0,
              cover: course.coverImageUrl,
              instructor: course.instructor?.name || 'IQC Instructor',
              status,
              progress: enrollment ? enrollment.progress : 0,
              completedModules: enrollment ? enrollment.completedModules : 0,
              totalModules: course._count.modules
            };

            return <CourseCard key={course.id} course={uiCourse} />;
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <h3>কোনো কোর্স পাওয়া যায়নি</h3>
          <p>এই মুহূর্তে এই বিভাগে কোনো কোর্স নেই।</p>
        </div>
      )}
    </div>
  );
}
