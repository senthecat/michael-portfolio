import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatUpdateDate, getRecentUpdates, heroTiles, mediaPoster, mediaSrc, projects } from '../data/projects';
import type { Category } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { mediaKind } from '../components/ProjectMedia';

// ── Photo mosaic ──────────────────────────────────────────────────────────────
const MOSAIC_ROWS = 5;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Rows of project photos drifting in alternating directions. Shuffled on each visit;
// holds still for visitors who prefer reduced motion.
function PhotoMosaic() {
  const rows = useMemo(
    () => Array.from({ length: MOSAIC_ROWS }, () => shuffle(heroTiles)),
    []
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-10%] flex flex-col justify-center gap-3 -rotate-6">
        {rows.map((tiles, r) => (
          <div
            key={r}
            className="flex w-max gap-3 motion-safe:animate-marquee even:motion-safe:animate-marquee-reverse"
            style={{ '--marquee-duration': `${90 + r * 15}s` } as React.CSSProperties}
          >
            {[...tiles, ...tiles].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-56 h-40 sm:w-64 sm:h-48 object-cover rounded-lg shrink-0"
                loading={r < 3 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Darken the photos, most of all behind the text */}
      <div className="absolute inset-0 bg-slate-950/60" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.4) 60%, transparent 100%)' }}
      />
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative h-[85vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-slate-950"
    >
      <PhotoMosaic />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Eyebrow */}
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Portfolio
        </p>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-none tracking-tight mb-6">
          Michael{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, #60a5fa, #a5f3fc)',
            }}
          >
            Tranfield
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto text-slate-200 text-lg sm:text-xl leading-relaxed mb-10">
          Mechanical Engineering · Computer Science
        </p>
        <p className="max-w-lg mx-auto text-slate-300 text-base leading-relaxed mb-12">
          I like to build things!!!
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#work"
            className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Explore Work
          </a>
          <Link
            to="/about"
            className="px-7 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg border border-white/20 backdrop-blur-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            About Me
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Project grid ──────────────────────────────────────────────────────────────
const FILTERS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'me', label: 'Mechanical' },
  { value: 'cs', label: 'Computer Science' },
];

function ProjectGrid() {
  const [params, setParams] = useSearchParams();
  const param = params.get('category');
  const filter: Category | 'all' = param === 'cs' || param === 'me' ? param : 'all';
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const select = (value: Category | 'all') => setParams(value === 'all' ? {} : { category: value }, { replace: true });

  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-16 max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 id="work-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Projects
          </h2>
          <p className="text-slate-500 mt-1">Hardware, software, and everything in between.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {FILTERS.map(({ value, label }) => {
            const count = value === 'all' ? projects.length : projects.filter((p) => p.category === value).length;
            const active = filter === value;
            return (
              <button
                key={value}
                onClick={() => select(value)}
                aria-pressed={active}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {label} <span className={active ? 'text-slate-300' : 'text-slate-400'}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

// ── Recent updates ────────────────────────────────────────────────────────────
function RecentUpdates() {
  const updates = getRecentUpdates(5);
  if (updates.length === 0) return null;

  return (
    <section aria-labelledby="updates-heading" className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 id="updates-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
          Recent updates
        </h2>
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {updates.map(({ project, update }) => {
            const thumb = update.media && (mediaKind(mediaSrc(update.media)) === 'image' ? mediaSrc(update.media) : mediaPoster(update.media));
            return (
              <li key={`${project.id}-${update.date}-${update.title}`}>
                <Link
                  to={`/projects/${project.category}/${project.slug}`}
                  className="group flex items-center gap-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {thumb ? (
                    <img src={thumb} alt="" loading="lazy" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100" />
                  ) : (
                    <span className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {formatUpdateDate(update.date)} · {project.title}
                    </p>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-150">
                      {update.title}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-1">{update.text}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors duration-150"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="bg-slate-50">
      <Hero />
      <ProjectGrid />
      <RecentUpdates />
    </main>
  );
}
