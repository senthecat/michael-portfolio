import { useNavigate, Link } from 'react-router-dom';

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0d1117 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />

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
        <p className="max-w-xl mx-auto text-slate-300 text-lg sm:text-xl leading-relaxed mb-10">
          Mechanical Engineering · Computer Science
        </p>
        <p className="max-w-lg mx-auto text-slate-400 text-base leading-relaxed mb-12">
          I like to build things!!!
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#explore"
            className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Explore Work
          </a>
          <Link
            to="/about"
            className="px-7 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg border border-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            About Me
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg
          className="w-4 h-4 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

// ── Split Panel ───────────────────────────────────────────────────────────────
interface SplitPanelProps {
  label: string;
  sub: string;
  to: string;
  gradient: string;
  patternColor: string;
}

function SplitPanel({ label, sub, to, gradient, patternColor }: SplitPanelProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      aria-label={`Explore ${label} projects`}
      className="group relative flex-1 min-h-[420px] sm:min-h-[500px] overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-400"
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-3 group-hover:text-white/80 transition-colors duration-300">
          {sub}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
          {label}
        </h2>
        <div className="flex items-center gap-2 text-white/70 group-hover:text-white group-hover:gap-4 transition-all duration-300">
          <span className="text-sm font-medium">View Projects</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

// ── Split Panels Section ──────────────────────────────────────────────────────
function SplitPanels() {
  return (
    <section id="explore" aria-label="Explore disciplines" className="flex flex-col sm:flex-row">
      <SplitPanel
        label="Computer Science"
        sub="Embedded · Firmware · IoT"
        to="/projects/cs"
        gradient="linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #0f2a5c 100%)"
        patternColor="rgba(96, 165, 250, 0.6)"
      />
      <SplitPanel
        label="Mechanical Engineering"
        sub="CAD · FEA · Manufacturing"
        to="/projects/me"
        gradient="linear-gradient(135deg, #064e3b 0%, #065f46 50%, #022c22 100%)"
        patternColor="rgba(52, 211, 153, 0.6)"
      />
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Hero />
      <SplitPanels />
    </main>
  );
}
