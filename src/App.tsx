import { Routes, Route, Link, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';

// ── Scroll to top on route change ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// A filtered link like /?category=me (e.g. from /projects/me) lands on the project grid instead.
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const grid = new URLSearchParams(search).has('category') && document.getElementById('work');
    // 'instant' overrides the site-wide smooth scrolling, which gets cut off mid-navigation.
    if (grid) grid.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    // Only on page changes; switching filters on the home page shouldn't jump the scroll.
  }, [pathname]);
  return null;
}

// ── Category pages ────────────────────────────────────────────────────────────
// /projects/cs and /projects/me now open the home page's project grid, pre-filtered.
function CategoryRedirect() {
  const { category } = useParams<{ category: string }>();
  const valid = category === 'cs' || category === 'me';
  return <Navigate to={valid ? `/?category=${category}` : '/'} replace />;
}

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold text-slate-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h1>
      <p className="text-slate-500 mb-8">This route doesn't exist.</p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
      >
        Go home
      </Link>
    </main>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects/:category" element={<CategoryRedirect />} />
        <Route path="/projects/:category/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
