import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer, WaFab, CookieConsent } from './components';
import type { Tweaks, PageParams } from './types';
import { useTweaks } from './hooks/useTweaks';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage').then((module) => ({ default: module.DestinationsPage })));
const DestinationDetailPage = lazy(() => import('./pages/DestinationDetailPage').then((module) => ({ default: module.DestinationDetailPage })));
const SeasonsPage = lazy(() => import('./pages/SeasonsPage').then((module) => ({ default: module.SeasonsPage })));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage').then((module) => ({ default: module.ActivitiesPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then((module) => ({ default: module.ReviewsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const PlannerPage = lazy(() => import('./pages/PlannerPage').then((module) => ({ default: module.PlannerPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((module) => ({ default: module.TermsPage })));

const TWEAK_DEFAULTS: Tweaks = {
  cardLayout: 'grid',
  accent: '#d97742',
};

function AppContent() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.setProperty('--sunset', t.accent);
  }, [t.accent]);

  const go = (route: string, p: PageParams = {}) => {
    if (route === 'destination' && p.id) {
      navigate(`/destination/${p.id}`);
    } else {
      navigate(`/${route === 'home' ? '' : route}`, { state: p });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isHome = location.pathname === '/';
  const currentRoute = location.pathname.split('/')[1] || 'home';

  return (
    <div data-screen-label={currentRoute}>
      {/* <Seo /> */}
      <Header route={currentRoute} go={go} transparent={isHome} />
      <Suspense fallback={<main aria-busy="true" style={{ minHeight: '60vh' }} />}>
        <Routes>
          <Route path="/" element={<HomePage go={go} t={t} />} />
          <Route path="/destinations" element={<DestinationsPage go={go} />} />
          <Route path="/destination/:id" element={<DestinationDetailPage go={go} />} />
          <Route path="/seasons" element={<SeasonsPage />} />
          <Route path="/activities" element={<ActivitiesPage go={go} />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Suspense>
      <Footer go={go} />
      <CookieConsent />
      <WaFab />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
