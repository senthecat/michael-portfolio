import { Link } from 'react-router-dom';
import { formatUpdateDate, mediaPoster, mediaSrc } from '../data/projects';
import type { Project } from '../data/projects';
import ProjectMedia from './ProjectMedia';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const href = `/projects/${project.category}/${project.slug}`;

  return (
    <Link
      to={href}
      className="group block bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`View project: ${project.title}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-100">
        <ProjectMedia
          src={mediaSrc(project.media[0])}
          poster={mediaPoster(project.media[0])}
          alt={`${project.title} preview`}
          mode="thumb"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            project.category === 'cs'
              ? 'bg-blue-600/90 text-white'
              : 'bg-emerald-600/90 text-white'
          }`}
        >
          {project.category === 'cs' ? 'Comp Sci' : 'Mechanical'}
        </span>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {project.status === 'in-progress' && (
            <span className="text-xs font-medium bg-amber-500/90 text-white px-2 py-0.5 rounded">
              In progress
            </span>
          )}
          {project.date && (
            <span className="text-xs font-medium bg-black/50 text-white px-2 py-0.5 rounded">
              {project.date}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors duration-150">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>
        {project.updates && project.updates.length > 0 && (
          <p className="text-xs text-slate-400 mt-2">
            Latest update: <span className="text-slate-600">{project.updates[0].title}</span> · {formatUpdateDate(project.updates[0].date)}
          </p>
        )}

        {/* Tech tags — first 4 only */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-xs text-slate-400 px-1 py-0.5">
              +{project.tech.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
