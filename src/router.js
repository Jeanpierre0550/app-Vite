import { isAuthenticated } from './auth.js';
import { loadView } from './ui.js';

const routes = {
  '/': 'home.html',
  '/login': 'login.html',
  '/dashboard': 'dashboard.html'
};

export function handleRoute() {
  const path = location.hash.slice(1) || '/';
  const view = routes[path];

  const publicRoutes = ['/', '/login'];
  const protectedRoutes = ['/dashboard'];

  if (protectedRoutes.includes(path) && !isAuthenticated()) {
    location.hash = '/login';
    return;
  }

  if (publicRoutes.includes(path) && isAuthenticated() && path === '/login') {
    location.hash = '/dashboard';
    return;
  }

  if (view) {
    loadView(view);
  } else {
    loadView('404.html');
  }
}
