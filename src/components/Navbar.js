export function renderNavbar(container) {
  container.innerHTML = `
    <nav class="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a href="#/" class="flex items-center space-x-3 group">
            <div class="relative w-10 h-10">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl rotate-3 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform opacity-60"></div>
              <div class="relative w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="url(#shieldGrad)" opacity="0.3"/>
                  <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8v4m0 0v1m0-1h0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="12" cy="15" r="0.5" fill="white"/>
                  <path d="M9 11.5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
                  <defs><linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="23"><stop stop-color="#93c5fd"/><stop offset="1" stop-color="#c084fc"/></linearGradient></defs>
                </svg>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-extrabold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight tracking-tight">MediCloud</span>
              <span class="text-[9px] font-medium text-blue-400/70 tracking-[0.2em] uppercase leading-none">Security</span>
            </div>
          </a>
          <div class="hidden md:flex items-center space-x-1">
            <a href="#/" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Home</a>
            <a href="#/identity" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Identity</a>
            <a href="#/encryption" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Encryption</a>
            <a href="#/network" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Network</a>
            <a href="#/threat-response" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Threat Response</a>
            <a href="#/monitoring" class="nav-link px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Monitoring</a>
            <span class="w-px h-5 bg-slate-700 mx-1"></span>
            <a href="#/simulator" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors">Simulator</a>
            <a href="#/zero-trust" class="px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-colors">Zero Trust</a>
          </div>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        <div id="mobile-menu" class="hidden md:hidden pb-4 space-y-1 border-t border-slate-700/50 pt-3">
          <a href="#/" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Home</a>
          <a href="#/identity" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Identity & Access</a>
          <a href="#/encryption" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Data Encryption</a>
          <a href="#/network" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Network Security</a>
          <a href="#/threat-response" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Threat Response</a>
          <a href="#/monitoring" class="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all">Monitoring</a>
          <div class="flex gap-2 pt-2">
            <a href="#/simulator" class="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors">Simulator</a>
            <a href="#/zero-trust" class="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-colors">Zero Trust</a>
          </div>
        </div>
      </div>
    </nav>`;

  const btn = container.querySelector('#mobile-menu-btn');
  const menu = container.querySelector('#mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.add('hidden'))
  );

  // Highlight active nav link on hash change
  function updateActiveNav() {
    const hash = window.location.hash.slice(1) || '/';
    container.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href').slice(1);
      if (href === hash) {
        link.classList.add('text-white', 'bg-slate-800');
      } else {
        link.classList.remove('text-white', 'bg-slate-800');
      }
    });
  }
  window.addEventListener('hashchange', updateActiveNav);
  updateActiveNav();
}
