import { handleRoute } from './router.js';

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
