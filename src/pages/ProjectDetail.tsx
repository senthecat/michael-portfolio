import { useParams, Navigate, Link } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { SiGithub } from 'react-icons/si';
import { formatUpdateDate, getProjectBySlug, mediaCaption, mediaPoster, mediaSrc } from '../data/projects';
import type { Category, MediaItem, ProjectModel, ProjectUpdate } from '../data/projects';
import ProjectMedia, { mediaKind } from '../components/ProjectMedia';

// three.js is large, so it's only downloaded on pages that actually have a 3D model.
const ModelViewer = lazy(() => import('../components/ModelViewer'));

// ── 3D model section ──────────────────────────────────────────────────────────
function ModelSection({ models, accentText, accentTab }: { models: ProjectModel[]; accentText: string; accentTab: string }) {
  const [active, setActive] = useState(0);
  const model = models[active];

  return (
    <section aria-labelledby="model-heading" className="mb-12">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <h2 id="model-heading" className={`text-base font-bold uppercase tracking-widest ${accentText}`}>
          Interactive 3D Model
        </h2>
        {models.length > 1 && (
          <div className="flex gap-1 bg-slate-200/70 p-1 rounded-lg" role="tablist" aria-label="3D models">
            {models.map((m, i) => (
              <button
                key={m.src}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`text-sm font-medium px-3 py-1 rounded-md transition-colors duration-150 ${
                  i === active ? `bg-white shadow-sm ${accentTab}` : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] sm:aspect-[16/9]">
        <Suspense fallback={<div className="w-full h-full bg-slate-100" />}>
          <ModelViewer key={model.src} src={model.src} label={model.label} color={model.color} />
        </Suspense>
      </div>
    </section>
  );
}

// ── Image gallery ─────────────────────────────────────────────────────────────
function Gallery({ media, title }: { media: MediaItem[]; title: string }) {
  const [active, setActive] = useState(0);
  const caption = mediaCaption(media[active]);

  return (
    <div className="space-y-3">
      {/* Main image — square and letterboxed so portrait phone photos aren't cropped */}
      <figure>
        <div className="rounded-xl overflow-hidden aspect-square bg-slate-900 border border-slate-200">
          <ProjectMedia
            key={active}
            src={mediaSrc(media[active])}
            poster={mediaPoster(media[active])}
            alt={caption ?? `${title} — ${active + 1} of ${media.length}`}
            className="w-full h-full object-contain"
          />
        </div>
        <figcaption className="flex justify-between gap-3 text-sm text-slate-600 mt-2 min-h-[1.25rem]">
          <span>{caption}</span>
          {media.length > 1 && (
            <span className="shrink-0 text-slate-400 tabular-nums">
              {active + 1} / {media.length}
            </span>
          )}
        </figcaption>
      </figure>

      {/* Thumbnails (only if multiple) */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Media thumbnails">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              role="listitem"
              aria-label={mediaCaption(m) ?? `View ${mediaKind(mediaSrc(m)) === 'image' ? 'photo' : 'video'} ${i + 1}`}
              aria-pressed={i === active}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                i === active ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <ProjectMedia src={mediaSrc(m)} poster={mediaPoster(m)} alt="" mode="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Updates timeline ──────────────────────────────────────────────────────────
function UpdatesTimeline({ updates, dotClass }: { updates: ProjectUpdate[]; dotClass: string }) {
  return (
    <ol className="relative border-l-2 border-slate-200 ml-2 space-y-8">
      {updates.map((u, i) => (
        <li key={i} className="pl-6 relative">
          <span
            className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ring-slate-50 ${dotClass}`}
            aria-hidden="true"
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatUpdateDate(u.date)}</p>
          <h3 className="font-semibold text-slate-900 mt-1">{u.title}</h3>
          <p className="text-slate-700 leading-relaxed mt-1">{u.text}</p>
          {u.media && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3] max-w-sm">
              <ProjectMedia
                src={mediaSrc(u.media)}
                poster={mediaPoster(u.media)}
                alt={mediaCaption(u.media) ?? u.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

// ── Tech tag ──────────────────────────────────────────────────────────────────
function TechTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-100 border border-slate-700">
      {label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  if (category !== 'cs' && category !== 'me') {
    return <Navigate to="/" replace />;
  }
  if (!slug) return <Navigate to="/" replace />;

  const cat = category as Category;
  const project = getProjectBySlug(cat, slug);

  if (!project) {
    return <Navigate to={`/projects/${cat}`} replace />;
  }

  const isCS = cat === 'cs';
  const accentText = isCS ? 'text-blue-600' : 'text-emerald-600';
  const accentBadge = isCS
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  const overviewPath = `/?category=${cat}`;
  const overviewLabel = isCS ? 'Computer Science' : 'Mechanical Engineering';

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb / back */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors duration-100">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link to={overviewPath} className="hover:text-slate-800 transition-colors duration-100">
            {overviewLabel}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-900 font-medium truncate">{project.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Title area */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${accentBadge}`}
            >
              {isCS ? 'Computer Science' : 'Mechanical Engineering'}
            </span>
            {project.status === 'in-progress' && (
              <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border bg-amber-100 text-amber-700 border-amber-200">
                In Progress
              </span>
            )}
            {project.date && (
              <span className="text-xs text-slate-500 font-medium">{project.date}</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>
        </div>

        {project.models && project.models.length > 0 && (
          <ModelSection
            models={project.models}
            accentText={accentText}
            accentTab={isCS ? 'text-blue-700' : 'text-emerald-700'}
          />
        )}

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left: details (3/5) */}
          <div className="lg:col-span-3 space-y-10">

            {/* Overview */}
            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className={`text-base font-bold uppercase tracking-widest mb-4 ${accentText}`}
              >
                Overview
              </h2>
              <p className="text-slate-700 leading-relaxed">{project.longDescription}</p>
            </section>

            {/* Updates */}
            {project.updates && project.updates.length > 0 && (
              <section aria-labelledby="updates-heading">
                <h2
                  id="updates-heading"
                  className={`text-base font-bold uppercase tracking-widest mb-6 ${accentText}`}
                >
                  Project Updates
                </h2>
                <UpdatesTimeline updates={project.updates} dotClass={isCS ? 'bg-blue-500' : 'bg-emerald-500'} />
              </section>
            )}

            {/* What I did */}
            <section aria-labelledby="bullets-heading">
              <h2
                id="bullets-heading"
                className={`text-base font-bold uppercase tracking-widest mb-4 ${accentText}`}
              >
                What I Did
              </h2>
              <ul className="space-y-4">
                {project.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className={`shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCS ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tools / Tech */}
            <section aria-labelledby="tech-heading">
              <h2
                id="tech-heading"
                className={`text-base font-bold uppercase tracking-widest mb-4 ${accentText}`}
              >
                Tools &amp; Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <TechTag key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Links */}
            {project.links && (project.links.github || project.links.demo || project.links.video) && (
              <section aria-labelledby="links-heading">
                <h2
                  id="links-heading"
                  className={`text-base font-bold uppercase tracking-widest mb-4 ${accentText}`}
                >
                  Links
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                      <SiGithub size={16} aria-hidden="true" />
                      View on GitHub
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {project.links.video && (
                    <a
                      href={project.links.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      Watch Video ↗
                    </a>
                  )}
                </div>
              </section>
            )}

          </div>

          {/* Right: images (2/5) */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <Gallery media={project.media} title={project.title} />
            </div>
          </div>

        </div>

        {/* Back button */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <Link
            to={overviewPath}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded ${
              isCS ? 'text-blue-600 hover:text-blue-800' : 'text-emerald-600 hover:text-emerald-800'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {overviewLabel} projects
          </Link>
        </div>

      </div>
    </main>
  );
}
