import { Link } from 'react-router-dom';
import { SiGithub, SiLinkedin } from 'react-icons/si';

// ── Photos ────────────────────────────────────────────────────────────────────
// Drop files in public/assets/about/ and list them here; the photo grid stays hidden until filled in.
// Paths need the site base, e.g. `${import.meta.env.BASE_URL}assets/about/headshot.jpg`.
const HEADSHOT: string | null = null;
const PHOTOS: { src: string; caption?: string }[] = [];

// ── Data ──────────────────────────────────────────────────────────────────────
interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
}

const experience: ExperienceItem[] = [
  {
    role: 'Software Development Engineering Intern, Amazon MSK',
    company: 'Amazon Web Services',
    period: 'Summer 2026',
    location: 'Seattle, WA',
    summary:
      'Automated performance testing for Managed Kafka: packaged the benchmark pipeline in Docker, ran it as weekly ECS tasks, and built a 240-configuration test matrix with CloudWatch dashboards.',
  },
  {
    role: 'Software Development Engineering Intern',
    company: 'Amazon Web Services',
    period: 'Summer 2025',
    location: 'Seattle, WA',
    summary: 'Built Lambda-based workflow diagnostics and an internal React/Java dashboard for visualizing failures.',
  },
  {
    role: 'App Development Intern',
    company: 'Blink (Amazon)',
    period: 'Summer 2024',
    location: 'North Reading, MA',
    summary: 'Added Siri Shortcuts to the Blink iOS app in Swift, so users can arm, disarm, and pull up live video by voice.',
  },
];

const skills: Record<string, string[]> = {
  Mechanical: ['SolidWorks', 'Surface modeling', '3D printing', 'Engine assembly', 'EFI and fuel systems'],
  'Embedded and controls': ['C/C++', 'nRF52840', 'ESP32', 'Arduino', 'KiCad', 'PD control', 'UART / I2C / USB HID'],
  Software: ['Python', 'Java', 'JavaScript', 'Swift', 'React', 'AWS', 'Docker', 'Kafka', 'Git', 'Linux'],
};

// ── Small pieces ──────────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-5">{children}</h2>;
}

function Headshot() {
  if (HEADSHOT) {
    return (
      <img
        src={HEADSHOT}
        alt="Michael Tranfield"
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white/10 shrink-0"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white/70 shrink-0"
    >
      MT
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-center gap-8 text-center sm:text-left">
          <Headshot />
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">Michael Tranfield</h1>
            <p className="text-slate-300 text-lg">Mechanical Engineering + Computer Science &amp; Engineering</p>
            <p className="text-slate-400">UC Irvine · Class of 2027</p>
            <div className="flex gap-3 mt-5 justify-center sm:justify-start">
              <a
                href="https://www.linkedin.com/in/michael-tranfield-28bab2294/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 transition-colors duration-150"
              >
                <SiLinkedin size={16} aria-hidden="true" /> LinkedIn
              </a>
              <a
                href="https://github.com/senthecat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 transition-colors duration-150"
              >
                <SiGithub size={16} aria-hidden="true" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">
        {/* Intro */}
        <section className="space-y-4 text-slate-700 text-lg leading-relaxed">
          <p>
            I'm a double major at UC Irvine, studying mechanical engineering and computer science &amp; engineering. I
            graduate in 2027.
          </p>
          <p>
            I like building things, and most of my projects land somewhere between the two majors. I designed and
            soldered my own stenography keyboard, wrote the controller for an autonomous robot in my mechanical
            systems lab, and I'm partway through an engine swap on a 1984 Corvette.
          </p>
          <p>
            I've spent the last three summers at Amazon: first on the Blink iOS app, then two software engineering
            internships at AWS, most recently on the Managed Kafka team.
          </p>
          <p>
            <Link to="/" className="font-semibold text-blue-600 hover:text-blue-800">
              See my projects →
            </Link>
          </p>
        </section>

        {/* Photos */}
        {PHOTOS.length > 0 && (
          <section aria-label="Photos" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PHOTOS.map((p) => (
              <figure key={p.src}>
                <img src={p.src} alt={p.caption ?? ''} loading="lazy" className="w-full aspect-square object-cover rounded-xl" />
                {p.caption && <figcaption className="text-xs text-slate-500 mt-1.5">{p.caption}</figcaption>}
              </figure>
            ))}
          </section>
        )}

        {/* Experience */}
        <section aria-labelledby="experience-heading">
          <SectionHeading>
            <span id="experience-heading">Experience</span>
          </SectionHeading>
          <ol className="space-y-7">
            {experience.map((item) => (
              <li key={item.role + item.period}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <h3 className="font-semibold text-slate-900">{item.role}</h3>
                  <span className="text-sm text-slate-500 shrink-0">{item.period}</span>
                </div>
                <p className="text-sm text-slate-500">
                  {item.company} · {item.location}
                </p>
                <p className="text-slate-700 mt-2 leading-relaxed">{item.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Education */}
        <section aria-labelledby="education-heading">
          <SectionHeading>
            <span id="education-heading">Education</span>
          </SectionHeading>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
            <h3 className="font-semibold text-slate-900">University of California, Irvine</h3>
            <span className="text-sm text-slate-500">2027</span>
          </div>
          <p className="text-slate-700">B.S. Mechanical Engineering · B.S. Computer Science &amp; Engineering</p>
          <p className="text-sm text-slate-500 mt-2">
            Amazon Future Engineer Scholarship · National Society of Leadership and Success
          </p>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-heading">
          <SectionHeading>
            <span id="skills-heading">Skills</span>
          </SectionHeading>
          <dl className="space-y-3">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group} className="sm:flex sm:gap-6">
                <dt className="font-semibold text-slate-900 sm:w-48 shrink-0">{group}</dt>
                <dd className="text-slate-700">{items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
