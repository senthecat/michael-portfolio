export type Category = 'cs' | 'me';

export interface ProjectLink {
  github?: string;
  demo?: string;
  video?: string;
}

export type ProjectStatus = 'in-progress' | 'complete';

export interface ProjectModel {
  src: string;
  label: string; // tab name when a project has several models, e.g. 'PCB' or 'Enclosure'
  color?: string; // STL files carry no color; defaults to a neutral gray
}

export interface ProjectUpdate {
  date: string; // 'YYYY-MM-DD', or 'YYYY-MM' when the day isn't known; shown as 'Oct 15, 2026' / 'May 2026'
  title: string;
  text: string;
  media?: MediaItem;
}

// A photo, video or YouTube URL, optionally with a caption (and a poster frame for videos).
export type MediaItem = string | { src: string; caption?: string; poster?: string };

export const mediaSrc = (m: MediaItem) => (typeof m === 'string' ? m : m.src);
export const mediaCaption = (m: MediaItem) => (typeof m === 'string' ? undefined : m.caption);
export const mediaPoster = (m: MediaItem) => (typeof m === 'string' ? undefined : m.poster);

export interface Project {
  id: string;
  category: Category;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  tech: string[];
  date?: string;
  status?: ProjectStatus;
  // Photos (.jpg/.png/.webp), videos (.mp4/.webm) or YouTube URLs. The first item is the card thumbnail.
  media: MediaItem[];
  // Interactive 3D models (.glb, .gltf or .stl), shown in a 360° viewer on the project page.
  models?: ProjectModel[];
  links?: ProjectLink;
  // Newest first. Shown as a timeline on the project page.
  updates?: ProjectUpdate[];
}

// ---------------------------------------------------------------------------
// Asset image helper — resolves paths relative to src/assets/.
// Change ASSETS_BASE to point at a different root if needed.
// ---------------------------------------------------------------------------
const ASSETS_BASE = `${import.meta.env.BASE_URL}assets`;
const img = (path: string) => `${ASSETS_BASE}/${path}`;
const photo = (path: string, caption?: string): MediaItem => ({ src: img(path), caption });
// Videos are converted to .mp4 with a matching '<name>_poster.jpg' frame alongside.
const vid = (path: string, caption?: string): MediaItem => ({
  src: img(path),
  caption,
  poster: img(path.replace(/\.mp4$/, '_poster.jpg')),
});

// ---------------------------------------------------------------------------
// Project data
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  // Shown in this order on the home page: projects with real photos and videos first.
  {
    id: 'corvette-engine-swap',
    category: 'me',
    slug: 'corvette-engine-swap',
    title: '1984 Corvette Engine Rebuild & Swap',
    shortDescription:
      'Bought a 1984 Corvette rolling shell with a knocking engine, diagnosed a spun bearing, and built a new Gen 1 roller small-block Chevy 350 with Holley Sniper 2 EFI. Install in progress.',
    longDescription:
      "I bought a 1984 Corvette rolling shell with a knocking engine and have been working on it since early 2026. After pulling the engine and tearing it down, I found a spun bearing caused by oil loss from a leaking rear main seal. The original block was beyond repair, so I bought a new block and built a Gen 1 roller small-block Chevy 350 from scratch. In place of the car's original Cross-Fire Injection, the new engine runs Holley Sniper 2 EFI, with aftermarket AFR cylinder heads and a Summit Racing SUM-K8802 cam. The project is now in the install phase, with the new engine and transmission going into the car.",
    bullets: [
      'Researched before wrenching: worked through the factory service manual, C4 owner forums, and rebuild guides to learn small-block layout, torque sequences, and the order of operations for a full rebuild.',
      'Pulled the original engine (disconnected fuel, coolant, electrical, and exhaust, unbolted the transmission, and lifted it out with a hoist), then tore it down to find the source of the knock.',
      'Traced the failure to a spun bearing caused by oil loss from a leaking rear main seal; the damage left the original block beyond repair.',
      'Sourced a new block and built a Gen 1 roller SBC 350 from the bare block up, including the rotating assembly.',
      'Replaced the original Cross-Fire Injection with Holley Sniper 2 EFI, and upgraded to aftermarket AFR heads and a Summit Racing SUM-K8802 cam.',
      'Painted the bellhousing, mated the transmission to the engine, and lowered them into the car together with an engine hoist.',
      'Worked through problems along the way, including seized hardware.',
    ],
    tech: [
      'SBC 350 (Gen 1 Roller)',
      'Holley Sniper 2 EFI',
      'AFR Heads',
      'Summit SUM-K8802 Cam',
      'Engine Building',
      'Failure Diagnosis',
      'Drivetrain Install',
    ],
    date: '2026',
    status: 'in-progress',
    media: [
      photo('me/corvette/engine_transmission_stand.jpg', 'Engine and transmission mated and on the hoist, ready to go in'),
      photo('me/corvette/rear_in_garage.jpg', 'The car as bought: a rolling shell with a knocking engine'),
      photo('me/corvette/spun_bearings.jpg', 'Failed bearings from the original engine'),
      photo('me/corvette/spun_crank.jpg', 'Crankshaft damage from the spun bearing'),
      photo('me/corvette/topside_bare.jpg', 'New block with pistons installed'),
      photo('me/corvette/rotating_assembly.jpg', 'Rotating assembly in the new block'),
      vid('me/corvette/img_4466.mp4', 'The new engine on the stand'),
      photo('me/corvette/bolt_stuck.jpg', 'A seized bolt, one of the problems along the way'),
      photo('me/corvette/engine_next_to_car.jpg', 'Assembled engine next to the car'),
      photo('me/corvette/spray_paint_bellhousing.jpg', 'Painting the bellhousing'),
      photo('me/corvette/engine_going_in_car.jpg', 'Lowering the engine into the car'),
    ],
    links: {},
    updates: [
      {
        date: '2026-10-15',
        title: 'Engine going in',
        text: 'Mated the transmission to the engine and started lowering them into the car with the hoist.',
        media: photo('me/corvette/engine_going_in_car.jpg', 'Lowering the engine into the car'),
      },
      {
        date: '2026-10-13',
        title: 'Prepping the transmission',
        text: 'Painted the bellhousing before mating it to the engine.',
        media: photo('me/corvette/spray_paint_bellhousing.jpg', 'Painting the bellhousing'),
      },
      {
        date: '2026-09-21',
        title: 'Engine assembled',
        text: 'The new engine is assembled and sitting next to the car, ready for install.',
        media: photo('me/corvette/engine_next_to_car.jpg', 'Assembled engine next to the car'),
      },
      {
        date: '2026-05',
        title: 'Engine on the stand',
        text: 'The rebuilt engine came together on the stand. Seized hardware slowed things down along the way.',
        media: vid('me/corvette/img_4466.mp4', 'The new engine on the stand'),
      },
      {
        date: '2026-03-21',
        title: 'Teardown and diagnosis',
        text: 'Pulled and tore down the original engine. Found a spun bearing caused by oil loss from a leaking rear main seal. The block was beyond repair, so I bought a new one to build from scratch.',
        media: photo('me/corvette/spun_bearings.jpg', 'Failed bearings from the original engine'),
      },
      {
        date: '2026-02-24',
        title: 'Brought it home',
        text: 'Bought a 1984 Corvette rolling shell with a knocking engine.',
        media: photo('me/corvette/rear_in_garage.jpg', 'The car as bought'),
      },
    ],
  },
  {
    id: 'autonomous-robot',
    category: 'me',
    slug: 'autonomous-pathing-robot',
    title: 'Autonomous Pathing Robot',
    shortDescription:
      'Autonomous robot for a head-to-head MAE 106 competition. I designed the PD heading controller and the checkpoint system that sequences it through the course.',
    longDescription:
      "Built by a four-person team in MAE 106 (Mechanical Systems Lab) for the end-of-quarter head-to-head class competition, the robot had to complete the course on its own, with no remote control. As the team's controller designer, I was responsible for keeping it on heading and moving it through the course in the right order.",
    bullets: [
      'Implemented closed-loop heading control on the microcontroller, using magnetometer feedback in a PD (proportional-derivative) loop.',
      'Tuned the controller gains experimentally on the robot to reduce overshoot and steady-state heading drift.',
      'Used a drivetrain-mounted limit switch as a distance sensor, giving the controller a measure of how far the robot had traveled.',
      'Built a checkpoint system on top of the heading and distance feedback to sequence the robot through the course autonomously.',
    ],
    tech: ['Arduino', 'C++', 'PD Control', 'Closed-Loop Control', 'Magnetometer', 'Limit Switch'],
    date: 'Mar 2026',
    status: 'complete',
    media: [
      vid('me/autonomous-robot/moving.mp4', 'Autonomous run outdoors'),
      vid('me/autonomous-robot/fire_slow.mp4', 'Drive mechanism actuating (slow motion)'),
      vid('me/autonomous-robot/single_fire.mp4', 'A single actuation of the drive mechanism'),
      vid('me/autonomous-robot/img_3513.mp4', 'Gear train turning the drive wheel'),
      photo('me/autonomous-robot/wiring.jpg', 'Electronics: Arduino (Elegoo Uno R3) and breadboard wiring'),
      vid('me/autonomous-robot/img_3522.mp4', 'Tuning on the bench'),
      vid('me/autonomous-robot/challenges.mp4', 'Indoor test run'),
    ],
    links: {},
  },
  {
    id: 'steno-keyboard',
    category: 'cs',
    slug: 'stenography-keyboard',
    title: 'Stenography Keyboard',
    shortDescription:
      'Custom USB HID keyboard with nRF52840 firmware, hand-routed KiCad PCB, and 3D-printed enclosure.',
    longDescription:
      'A fully custom stenography keyboard designed from the ground up — from schematic capture and PCB fabrication to firmware development and physical assembly. The goal was to achieve professional-grade HID latency in a compact, self-contained device.',
    bullets: [
      'Designed a multi-layer PCB in KiCad: schematic capture, component placement, hand-routed traces, and DRC/ERC sign-off before sending to fab.',
      'Sourced and soldered all SMD and through-hole components; validated signal integrity with an oscilloscope and logic analyzer.',
      'Wrote nRF52840 firmware in C: event-driven key-matrix scanning with diode isolation to support full n-key rollover without ghosting.',
      'Optimized USB HID report loop to achieve ~3 ms end-to-end latency vs. ~20 ms on a serial-over-USB baseline, benchmarked over 200+ keystroke samples.',
      'Designed and 3D-printed a two-piece enclosure prototype with snap-fit tolerancing; iterated twice based on fitment and cable routing.',
      'Implemented non-blocking firmware architecture (no busy-waits) to keep the main loop deterministic and real-time safe.',
    ],
    tech: ['nRF52840', 'C', 'KiCad', 'USB HID', 'SolidWorks', '3D Printing', 'Oscilloscope', 'Logic Analyzer'],
    date: '2025-2026',
    media: [
      photo('cs/steno/fully_assembled.jpg', 'Fully assembled in its 3D-printed case'),
      photo('cs/steno/keycaps_on.jpg', 'Keycaps on, with the microcontroller wired up'),
      photo('cs/steno/done_soldering.jpg', 'All switches soldered to the PCB'),
      photo('cs/steno/steno_pcb.png', '3D render of the PCB from KiCad'),
      vid('cs/steno/printing_case.mp4', 'Printing the case'),
    ],
    models: [{ src: img('cs/steno/steno_pcb.glb'), label: 'PCB' }],
    links: {
      github: 'https://github.com/senthecat',
    },
    updates: [
      {
        date: '2026-03-10',
        title: 'Fully assembled',
        text: 'Printed the case and assembled the finished keyboard.',
        media: photo('cs/steno/fully_assembled.jpg', 'Fully assembled in its 3D-printed case'),
      },
      {
        date: '2026-02-26',
        title: 'Keycaps on',
        text: 'Switches soldered, keycaps installed, and the microcontroller wired up.',
        media: photo('cs/steno/keycaps_on.jpg', 'Keycaps on, with the microcontroller wired up'),
      },
    ],
  },
  {
    id: 'esp32-messaging',
    category: 'cs',
    slug: 'esp32-remote-messaging',
    title: 'ESP32 Remote Messaging System',
    shortDescription:
      'WiFi-connected ESP32 device that receives server-routed messages and displays them on a 16×2 LCD with scrolling text.',
    longDescription:
      'An end-to-end IoT messaging pipeline: a web front-end posts text to an AWS-hosted server, which filters and routes messages to registered ESP32 devices. The device persists messages in EEPROM and lets the user cycle through them on a character LCD.',
    bullets: [
      'Provisioned an AWS EC2 instance and wrote a lightweight Node.js message-broker that receives POST requests from the web UI and routes them to registered device IDs.',
      'Built a React-based web textbox UI for composing and sending messages; deployed to S3 with CloudFront distribution.',
      'Implemented WiFi provisioning and HTTP polling on the ESP32 using the Arduino framework; device reconnects automatically on drop.',
      'Stored up to 16 messages in EEPROM with a circular-buffer layout to survive power cycles without an RTC or SD card.',
      'Wrote a smooth scrolling-text renderer for the 16×2 character LCD, driven by a non-blocking timer ISR.',
      'Added a hardware debounced push-button that cycles the display to the next queued message.',
    ],
    tech: ['ESP32', 'C++', 'Arduino', 'AWS EC2', 'Node.js', 'React', 'EEPROM', 'LCD', 'WiFi', 'HTTP'],
    date: '2023',
    media: [
      img('cs/esp32_architecture.png'),
      img('cs/esp32_hardware.png'),
      img('cs/esp32_webui.png'),
    ],
    links: {
      github: 'https://github.com/senthecat',
    },
  },
  {
    id: 'ninja-h2r',
    category: 'me',
    slug: 'kawasaki-ninja-h2r-cad',
    title: 'Kawasaki Ninja H2R — Full CAD Assembly',
    shortDescription:
      'High-fidelity parametric SolidWorks assembly of the Kawasaki Ninja H2R, including complex aerodynamic surface geometry.',
    longDescription:
      'A from-scratch SolidWorks recreation of the Kawasaki Ninja H2R supercharged motorcycle. The project focused on advanced surface modeling for the aerodynamic bodywork and correct assembly constraints across a multi-part hierarchy. Every major sub-assembly (frame, fairings, engine block silhouette, swingarm) was modeled as an independent part file and mated into a top-level assembly.',
    bullets: [
      'Broke the motorcycle into logical sub-assemblies (chassis, aerodynamic fairings, powertrain silhouette, suspension linkages) to keep the feature tree manageable.',
      'Used SolidWorks Surface tools (lofted surfaces, boundary surfaces, filled surfaces) to recreate the compound-curved fairings and the distinctive aerodynamic winglets.',
      'Applied parametric dimensions and design tables so key geometry (wheelbase, fairing height, wing chord) can be modified globally without rebuilding.',
      'Defined assembly mates (coincident, concentric, distance) to ensure correct DOF constraints; ran interference detection to verify no part overlaps.',
      'Referenced manufacturer drawings, press photos, and scaled 3-view blueprints to validate overall proportions against real-world dimensions.',
      'Rendered final assembly in SolidWorks Visualize for presentation-quality output.',
    ],
    tech: ['SolidWorks', 'Surface Modeling', 'Parametric Design', 'Assembly Mates', 'SolidWorks Visualize', 'Technical Drawing'],
    date: '2024',
    media: [
      img('me/h2r_isometric.png'),
      img('me/h2r_fairing.png'),
      img('me/h2r_frame.png'),
    ],
    links: {},
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const getProjectsByCategory = (cat: Category): Project[] =>
  projects.filter((p) => p.category === cat);

export const getProjectBySlug = (cat: Category, slug: string): Project | undefined =>
  projects.find((p) => p.category === cat && p.slug === slug);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-10-15' → 'Oct 15, 2026'; '2026-05' → 'May 2026'. Anything else is shown as written.
export const formatUpdateDate = (date: string): string => {
  const m = date.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return date;
  const month = MONTHS[Number(m[2]) - 1];
  return m[3] ? `${month} ${Number(m[3])}, ${m[1]}` : `${month} ${m[1]}`;
};

// Latest updates across all projects, newest first.
export const getRecentUpdates = (limit: number): { project: Project; update: ProjectUpdate }[] =>
  projects
    .flatMap((project) => (project.updates ?? []).map((update) => ({ project, update })))
    .sort((a, b) => b.update.date.localeCompare(a.update.date))
    .slice(0, limit);

// Small pre-cropped tiles for the home page mosaic, generated from the project photos.
export const heroTiles: string[] = [
  'me_corvette_engine_transmission_stand',
  'me_corvette_engine_next_to_car',
  'me_corvette_rotating_assembly',
  'me_corvette_topside_bare',
  'me_corvette_engine_going_in_car',
  'me_corvette_rear_in_garage',
  'me_corvette_spun_crank',
  'me_corvette_img_4466',
  'me_autonomous-robot_wiring',
  'me_autonomous-robot_moving',
  'me_autonomous-robot_challenges',
  'me_autonomous-robot_img_3513',
  'me_autonomous-robot_img_3522',
  'me_autonomous-robot_fire_slow',
  'cs_steno_pcb',
  'cs_steno_fully_assembled',
].map((name) => img(`hero/${name}.jpg`));
