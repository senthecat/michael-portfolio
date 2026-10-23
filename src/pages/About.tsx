import { Link } from 'react-router-dom';

// ── Skill tag ─────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 font-medium border border-slate-200">
      {label}
    </span>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-200">
      {children}
    </h2>
  );
}

// ── At a glance item ──────────────────────────────────────────────────────────
function GlanceRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">{item.company}</h3>
          <p className="text-sm text-slate-500">{item.role}</p>
        </div>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
          {item.period}
        </span>
      </div>
      <ul className="space-y-1.5">
        {item.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="text-blue-400 mt-0.5 shrink-0" aria-hidden="true">›</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const skills = {
  'Embedded & Firmware': ['C', 'C++', 'nRF52840', 'ESP32', 'USB HID', 'EEPROM', 'UART/SPI/I2C', 'FreeRTOS'],
  'Electronics & PCB': ['KiCad', 'Schematic Capture', 'PCB Layout', 'SMD Soldering', 'Oscilloscope', 'Logic Analyzer'],
  'Mechanical': ['SolidWorks', 'Surface Modeling', 'Parametric Design', 'GD&T', 'FEA', '3D Printing', 'CAD/CAM'],
  'Software': ['Python', 'TypeScript', 'React', 'Node.js', 'Git', 'Linux', 'AWS'],
};

const experience: ExperienceItem[] = [
  {
    company: 'Amazon Web Services (AWS)',
    role: 'Software Engineering Intern',
    period: '2024',
    bullets: [
      'Worked on distributed cloud infrastructure tooling within a service team.',
      'Contributed features and bug fixes in a fast-paced production codebase.',
    ],
  },
  {
    company: 'Blink (Amazon subsidiary)',
    role: 'Engineering Intern',
    period: '2023',
    bullets: [
      'Worked on embedded firmware and IoT device development for smart home security cameras.',
      'Contributed to firmware validation, hardware bring-up testing, and tooling improvements.',
    ],
  },
];

const keyProjects = [
  { label: 'Stenography Keyboard', to: '/projects/cs/stenography-keyboard', badge: 'CS' },
  { label: 'ESP32 Remote Messaging System', to: '/projects/cs/esp32-remote-messaging', badge: 'CS' },
  { label: '1984 Corvette Engine Rebuild & Swap', to: '/projects/me/corvette-engine-swap', badge: 'ME' },
  { label: 'Autonomous Pathing Robot', to: '/projects/me/autonomous-pathing-robot', badge: 'ME' },
  { label: 'Kawasaki Ninja H2R CAD Model', to: '/projects/me/kawasaki-ninja-h2r-cad', badge: 'ME' },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header band */}
      <div className="bg-navy-900 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Michael Tranfield
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            I'm an engineer that enjoys understanding the innerworkings of machinery, computers, and technology.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">

        {/* Bio */}
        <section aria-labelledby="bio-heading">
          <SectionHeading>Background</SectionHeading>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              My engineering focus spans three closely linked domains: embedded firmware
              (writing bare-metal C for ARM Cortex-M devices), PCB design (schematic capture
              through fabrication in KiCad), and mechanical CAD (parametric modeling and surface
              work in SolidWorks). Interning at AWS and Blink has given me production-grade
              software experience to complement the hardware side.
            </p>
            <p>
              I build fast, reliable systems and care deeply about the details — whether that's
              optimizing a USB HID report loop from 20 ms down to 3 ms, or getting the
              surface loft on a motorcycle fairing to look right.
            </p>
          </div>
        </section>

        {/* At a glance */}
        <section aria-labelledby="glance-heading">
          <SectionHeading>At a Glance</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <GlanceRow icon="⚙️" label="Primary Focus" value="Embedded Systems & Firmware" />
            <GlanceRow icon="🔌" label="Hardware" value="PCB Design, KiCad, SMD Assembly" />
            <GlanceRow icon="📐" label="Mechanical" value="SolidWorks, Surface Modeling, FEA" />
            <GlanceRow icon="☁️" label="Cloud / Software" value="AWS, Node.js, Python, TypeScript" />
            <GlanceRow icon="🧠" label="Microcontrollers" value="nRF52840, ESP32, STM32" />
            <GlanceRow icon="🛠️" label="Protocols" value="USB HID, SPI, I2C, UART, WiFi, BLE" />
          </div>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-heading">
          <SectionHeading>Skills & Tools</SectionHeading>
          <div className="space-y-6">
            {Object.entries(skills).map(([category, tags]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section aria-labelledby="experience-heading">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-4">
            {experience.map((item) => (
              <ExperienceCard key={item.company} item={item} />
            ))}
          </div>
        </section>

        {/* Key projects */}
        <section aria-labelledby="projects-heading">
          <SectionHeading>Key Projects</SectionHeading>
          <ul className="space-y-3">
            {keyProjects.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm group transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                      p.badge === 'CS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-slate-800 font-medium text-sm group-hover:text-blue-600 transition-colors duration-150">
                    {p.label}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-blue-500 ml-auto transition-colors duration-150"
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
            ))}
          </ul>
        </section>

      </div>
    </main>
  );
}
