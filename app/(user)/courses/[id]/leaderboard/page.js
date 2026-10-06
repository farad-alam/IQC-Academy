import { redirect } from 'next/navigation';

export default async function CourseLeaderboardRedirect({ params }) {
  const { id } = await params;
  redirect(`/learn/${id}/leaderboard`);
}
