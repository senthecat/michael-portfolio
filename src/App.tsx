import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProjectsOverview from './pages/ProjectsOverview';
import ProjectDetail from './pages/ProjectDetail';

// ── Scroll to top on route change ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
        <Route path="/projects/:category" element={<ProjectsOverview />} />
        <Route path="/projects/:category/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
