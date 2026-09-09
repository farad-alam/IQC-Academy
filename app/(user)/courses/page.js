import prisma from '@/lib/db';
import Link from 'next/link';
import CourseCard from '@/components/features/CourseCard';
import EnrolledCoursesFilter from './EnrolledCoursesFilter';

// ── ISR: The course list is fully public content. No auth here.
// Enrollment badges are loaded client-side by EnrolledCoursesFilter.
// revalidatePath('/courses') is called by admin APIs on course create/update/delete.
export const revalidate = 3600;

export default async function CourseListPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams?.filter || 'all';

  // Base query — public, no user-specific data
  const where = { status: 'PUBLISHED', isBatchCourse: false };
  if (filter === 'paid') where.type = 'PAID';
  else if (filter === 'free') where.type = 'FREE';

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: { select: { name: true } },
      _count: { select: { subjects: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Serialize for client — only what CourseCard actually needs
  const serializedCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    duration: course.duration,
    type: course.type === 'PAID' ? 'paid' : 'free',
    price: course.price ? course.price.toString() : 0,
    cover: course.coverImageUrl,
    instructor: course.instructor?.name || 'IQC Instructor',
    totalSubjects: course._count.subjects,
    // Enrollment fields default — overridden client-side for logged-in users
    status: course.type === 'PAID' ? 'locked' : 'available',
    progress: 0,
    completedModules: 0,
  }));

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

      {/* EnrolledCoursesFilter is a client component that hydrates enrollment badges
          after mount via /api/users/me-minimal + enrollment data, without blocking
          the initial static render of this page. */}
      <EnrolledCoursesFilter courses={serializedCourses} filter={filter} />
    </div>
  );
}
