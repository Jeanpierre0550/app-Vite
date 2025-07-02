import { getUser, logout } from './auth.js';
import { loadTasks, setupTaskForm } from './tasks.js';

export async function loadView(view) {
  const app = document.getElementById('app');
  const res = await fetch(`/src/views/${view}`);
  const html = await res.text();
  app.innerHTML = html;

  setupNav();

  if (view === 'login.html') {
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const role = document.getElementById('role').value.trim();

      if (!username || !role) {
        document.getElementById('login-error').textContent = 'Todos los campos son requeridos.';
        return;
      }

      localStorage.setItem('user', JSON.stringify({ username, role }));
      location.hash = '/dashboard';
    });
  }

  if (view === 'dashboard.html') {
    const user = getUser();
    document.getElementById('username-dashboard').textContent = user.username;
    loadTasks();
    setupTaskForm();
  }
}

function setupNav() {
  const nav = document.querySelector('nav');
  const user = getUser();

  if (user) {
    nav.style.display = 'block';
    document.getElementById('user-name').textContent = `👤 ${user.username}`;
    document.getElementById('logout-btn').addEventListener('click', () => {
      logout();
      location.hash = '/login';
    });
  } else {
    nav.style.display = 'none';
  }
}
