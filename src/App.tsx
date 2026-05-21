import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer, WaFab } from './components';
import {
  HomePage,
  DestinationsPage,
  DestinationDetailPage,
  SeasonsPage,
  ActivitiesPage,
  ReviewsPage,
  ContactPage,
  PlannerPage,
} from './pages';
import type { Tweaks, PageParams } from './types';
import { useTweaks } from './hooks/useTweaks';

const TWEAK_DEFAULTS: Tweaks = {
  cardLayout: 'grid',
  accent: '#d97742',
};

function AppContent() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.setProperty('--sunset', t.accent);
  }, [t.accent]);

  const go = (route: string, p: PageParams = {}) => {
    if (route === 'destination' && p.id) {
      navigate(`/destination/${p.id}`);
    } else {
      navigate(`/${route === 'home' ? '' : route}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isHome = location.pathname === '/';
  const currentRoute = location.pathname.split('/')[1] || 'home';

  return (
    <div data-screen-label={currentRoute}>
      <Header route={currentRoute} go={go} transparent={isHome} />
      <Routes>
        <Route path="/" element={<HomePage go={go} t={t} setTweak={setTweak} />} />
        <Route path="/destinations" element={<DestinationsPage go={go} t={t} setTweak={setTweak} />} />
        <Route path="/destination/:id" element={<DestinationDetailPage go={go} />} />
        <Route path="/seasons" element={<SeasonsPage go={go} />} />
        <Route path="/activities" element={<ActivitiesPage go={go} />} />
        <Route path="/planner" element={<PlannerPage go={go} />} />
        <Route path="/reviews" element={<ReviewsPage go={go} />} />
        <Route path="/contact" element={<ContactPage go={go} />} />
      </Routes>
      <Footer go={go} />
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
