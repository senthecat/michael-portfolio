import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { getProjectsByCategory } from '../data/projects';

// ── Icon for LinkedIn / GitHub ───────────────────────────────────────────────
function ExternalIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
    >
      {children}
    </a>
  );
}

// ── Project dropdown ──────────────────────────────────────────────────────────
interface DropdownProps {
  label: string;
  category: 'cs' | 'me';
  align: 'left' | 'right';
}

function ProjectDropdown({ label, category, align }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const projects = getProjectsByCategory(category);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Close on Escape; arrow-key navigation inside menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (!open) return;
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [];
    const arr = Array.from(items);
    const focused = document.activeElement;
    const idx = arr.indexOf(focused as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      arr[(idx + 1) % arr.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      arr[(idx - 1 + arr.length) % arr.length]?.focus();
    }
  };

  // Open menu and focus first item
  const openMenu = () => {
    setOpen(true);
    setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    }, 10);
  };

  const toggleMenu = () => (open ? close() : openMenu());

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={close}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={`dropdown-${category}`}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold tracking-wide uppercase
          transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
          ${open ? 'text-white' : 'text-slate-300 hover:text-white'}
        `}
      >
        {label}
        {/* Chevron */}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel — pt-2 replaces mt-1 so hover area is unbroken */}
      <div
        role="none"
        className={`
          absolute top-full pt-2 min-w-[220px] z-50
          ${align === 'right' ? 'right-0' : 'left-0'}
          ${open ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        <div
          className={`
            bg-navy-800 border border-white/10 rounded-lg
            shadow-xl shadow-black/40 overflow-hidden
            transition-all duration-150 origin-top
            ${open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95'}
          `}
        >
        <ul
          id={`dropdown-${category}`}
          ref={menuRef}
          role="menu"
          aria-label={`${label} projects`}
          className="py-1"
        >
          {/* Overview link */}
          <li role="none">
            <NavLink
              to={`/projects/${category}`}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={close}
              className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-blue-400 hover:bg-white/5 focus:outline-none focus-visible:bg-white/5"
            >
              All {label} Projects →
            </NavLink>
          </li>
          <li role="none" className="border-t border-white/10 my-1" aria-hidden="true" />
          {projects.map((p) => (
            <li key={p.id} role="none">
              <NavLink
                to={`/projects/${category}/${p.slug}`}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={close}
                className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:bg-white/5 transition-colors duration-100"
              >
                {p.title}
              </NavLink>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}

// ── Mobile hamburger menu ─────────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  const csProjects = getProjectsByCategory('cs');
  const meProjects = getProjectsByCategory('me');

  return (
    <div className="md:hidden bg-navy-800 border-t border-white/10 px-4 py-4 space-y-4">
      <NavLink
        to="/"
        onClick={onClose}
        className="block text-slate-300 hover:text-white py-1.5 font-medium"
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        onClick={onClose}
        className="block text-slate-300 hover:text-white py-1.5 font-medium"
      >
        About Me
      </NavLink>

      <div>
        <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">
          Computer Science
        </p>
        <NavLink
          to="/projects/cs"
          onClick={onClose}
          className="block text-slate-300 hover:text-white py-1 pl-2"
        >
          All CS Projects
        </NavLink>
        {csProjects.map((p) => (
          <NavLink
            key={p.id}
            to={`/projects/cs/${p.slug}`}
            onClick={onClose}
            className="block text-slate-400 hover:text-white py-1 pl-2 text-sm"
          >
            {p.title}
          </NavLink>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">
          Mechanical Engineering
        </p>
        <NavLink
          to="/projects/me"
          onClick={onClose}
          className="block text-slate-300 hover:text-white py-1 pl-2"
        >
          All ME Projects
        </NavLink>
        {meProjects.map((p) => (
          <NavLink
            key={p.id}
            to={`/projects/me/${p.slug}`}
            onClick={onClose}
            className="block text-slate-400 hover:text-white py-1 pl-2 text-sm"
          >
            {p.title}
          </NavLink>
        ))}
      </div>

      <div className="flex gap-5 pt-2 border-t border-white/10">
        <ExternalIconLink href="https://www.linkedin.com/in/michael-tranfield-28bab2294/" label="LinkedIn">
          <SiLinkedin size={20} />
        </ExternalIconLink>
        <ExternalIconLink href="https://github.com/senthecat" label="GitHub">
          <SiGithub size={20} />
        </ExternalIconLink>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-sm border-b border-white/8 shadow-lg shadow-black/20"
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6"
      >
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-3 items-center h-14">
          {/* Left — CS dropdown */}
          <div className="flex items-center justify-start">
            <ProjectDropdown label="Comp Sci" category="cs" align="left" />
          </div>

          {/* Center — Home, About, icons */}
          <div className="flex items-center justify-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              About
            </NavLink>
            <span className="mx-2 h-4 w-px bg-white/20" aria-hidden="true" />
            <ExternalIconLink href="https://www.linkedin.com/in/michael-tranfield-28bab2294/" label="LinkedIn profile">
              <SiLinkedin size={18} />
            </ExternalIconLink>
            <span className="mx-1" aria-hidden="true" />
            <ExternalIconLink href="https://github.com/senthecat" label="GitHub profile">
              <SiGithub size={18} />
            </ExternalIconLink>
          </div>

          {/* Right — ME dropdown */}
          <div className="flex items-center justify-end">
            <ProjectDropdown label="Mechanical" category="me" align="right" />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex items-center justify-between h-14">
          {/* Logo / name */}
          <Link
            to="/"
            className="text-white font-bold text-base tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            MT
          </Link>

          {/* Icons + hamburger */}
          <div className="flex items-center gap-4">
            <ExternalIconLink href="https://www.linkedin.com/in/michael-tranfield-28bab2294/" label="LinkedIn profile">
              <SiLinkedin size={18} />
            </ExternalIconLink>
            <ExternalIconLink href="https://github.com/senthecat" label="GitHub profile">
              <SiGithub size={18} />
            </ExternalIconLink>
            <button
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="text-slate-300 hover:text-white p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {mobileOpen ? (
                /* X icon */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div id="mobile-menu">
          <MobileMenu onClose={closeMobile} />
        </div>
      )}
    </header>
  );
}
