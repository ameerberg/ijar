import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CarDetailPage } from './pages/CarDetailPage';
import { HostDashboard } from './pages/HostDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AddCarPage } from './pages/AddCarPage';

type Route = 'home' | 'car-detail' | 'host-dashboard' | 'admin' | 'login' | 'signup' | 'add-car';

function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [carId, setCarId] = useState<string>('1');

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path === '/login' || hash === '#/login') {
      setCurrentRoute('login');
    } else if (path === '/signup' || hash === '#/signup') {
      setCurrentRoute('signup');
    } else if (path === '/add-car' || hash === '#/add-car') {
      setCurrentRoute('add-car');
    } else if (path === '/host-dashboard' || hash === '#/host-dashboard') {
      setCurrentRoute('host-dashboard');
    } else if (path === '/admin' || hash === '#/admin') {
      setCurrentRoute('admin');
    } else if (path.startsWith('/cars/') || hash.startsWith('#/cars/')) {
      const id = path.split('/cars/')[1] || hash.split('#/cars/')[1] || '1';
      setCarId(id);
      setCurrentRoute('car-detail');
    } else {
      setCurrentRoute('home');
    }

    const handlePopState = () => {
      const newPath = window.location.pathname;
      const newHash = window.location.hash;

      if (newPath === '/login' || newHash === '#/login') {
        setCurrentRoute('login');
      } else if (newPath === '/signup' || newHash === '#/signup') {
        setCurrentRoute('signup');
      } else if (newPath === '/add-car' || newHash === '#/add-car') {
        setCurrentRoute('add-car');
      } else if (newPath === '/host-dashboard' || newHash === '#/host-dashboard') {
        setCurrentRoute('host-dashboard');
      } else if (newPath === '/admin' || newHash === '#/admin') {
        setCurrentRoute('admin');
      } else if (newPath.startsWith('/cars/') || newHash.startsWith('#/cars/')) {
        const id = newPath.split('/cars/')[1] || newHash.split('#/cars/')[1] || '1';
        setCarId(id);
        setCurrentRoute('car-detail');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const showHeaderFooter = currentRoute !== 'login' && currentRoute !== 'signup' && currentRoute !== 'add-car';

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Header />}

      <main className="flex-1">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'car-detail' && <CarDetailPage carId={carId} />}
        {currentRoute === 'host-dashboard' && <HostDashboard />}
        {currentRoute === 'admin' && <AdminPanel />}
        {currentRoute === 'login' && <LoginPage />}
        {currentRoute === 'signup' && <SignUpPage />}
        {currentRoute === 'add-car' && <AddCarPage />}
      </main>

      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;