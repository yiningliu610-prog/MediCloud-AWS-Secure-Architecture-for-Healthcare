const routes = {};
let currentCleanup = null;
let appElement = null;

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  window.location.hash = path;
}

export async function initRouter(container) {
  appElement = container;

  function getSafeRoute(hash) {
    let fn = null;

    if (Object.prototype.hasOwnProperty.call(routes, hash) && typeof routes[hash] === 'function') {
      fn = routes[hash];
    } else if (Object.prototype.hasOwnProperty.call(routes, '/') && typeof routes['/'] === 'function') {
      fn = routes['/'];
    }

    return fn;
  }

  async function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const renderFn = getSafeRoute(hash);
    if (!renderFn) return;

    // Page exit transition
    appElement.classList.add('page-exit');
    await new Promise(r => setTimeout(r, 200));

    // Cleanup previous page
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    appElement.innerHTML = '';
    window.scrollTo(0, 0);

    // Render new page
    currentCleanup = await renderFn(appElement);

    // Page enter
    appElement.classList.remove('page-exit');
  }

  window.addEventListener('hashchange', handleRoute);
  // Initial render without exit animation
  const hash = window.location.hash.slice(1) || '/';
  const renderFn = getSafeRoute(hash);
  if (renderFn) {
    currentCleanup = await renderFn(appElement);
  }
}
