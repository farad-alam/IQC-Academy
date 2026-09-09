'use client';
import { useState, useEffect } from 'react';
import CourseCard from '@/components/features/CourseCard';

/**
 * Client component that renders the course grid.
 * On mount, checks if the user is logged in (via /api/users/me-minimal).
 * If yes, fetches their enrollments and overlays the enrollment status/progress
 * onto the statically-rendered course list without blocking the initial paint.
 */
export default function EnrolledCoursesFilter({ courses, filter }) {
  const [displayCourses, setDisplayCourses] = useState(courses);

  useEffect(() => {
    // Lightweight check — only name/email/role returned
    fetch('/api/users/me-minimal')
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (!data?.user) return; // not logged in — show default (locked/available)

        // Fetch user's enrollments
        const enrRes = await fetch('/api/users/my-enrollments');
        if (!enrRes.ok) return;
        const { enrollments = [] } = await enrRes.json();

        // Merge enrollment data into course list
        const merged = courses.map(course => {
          const enrollment = enrollments.find(e => e.courseId === course.id);
          if (!enrollment) return course;
          return {
            ...course,
            status: enrollment.status === 'COMPLETED' ? 'completed' : 'enrolled',
            progress: enrollment.progress || 0,
            completedModules: enrollment.completedModules || 0,
          };
        });

        // If filtering by enrolled, only show enrolled courses
        if (filter === 'enrolled') {
          const enrolled = enrollments.map(e => e.courseId);
          setDisplayCourses(merged.filter(c => enrolled.includes(c.id)));
        } else {
          setDisplayCourses(merged);
        }
      })
      .catch(() => {}); // fail silently — anonymous view still works
  }, []);  // runs once on mount

  if (displayCourses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎓</div>
        <h3>কোনো কোর্স পাওয়া যায়নি</h3>
        <p>এই মুহূর্তে এই বিভাগে কোনো কোর্স নেই।</p>
      </div>
    );
  }

  return (
    <div className="grid grid-3 gap-6">
      {displayCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
