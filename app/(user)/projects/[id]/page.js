import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ProjectDonateClient from './ProjectDonateClient';
import { getSiteSettings } from '@/lib/siteSettings';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project) return { title: 'Project Not Found' };
  
  return {
    title: `${project.title} | IQC Academy`,
    description: project.description
  };
}

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project || project.status !== 'ACTIVE') {
    notFound();
  }

  const settings = await getSiteSettings();

  return <ProjectDonateClient project={project} settings={settings} />;
}
