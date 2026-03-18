export function showModal({ title, body, size = 'md' }) {
  const root = document.getElementById('modal-root');
  const sizeClass = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop"></div>
    <div class="relative bg-slate-800 rounded-2xl ${sizeClass} w-full max-h-[85vh] overflow-y-auto border border-slate-600/50 shadow-2xl modal-content" style="transform: scale(0.95); opacity: 0; transition: all 0.2s ease">
      <div class="sticky top-0 bg-slate-800/95 backdrop-blur-sm px-6 py-4 border-b border-slate-700/50 flex justify-between items-center z-10 rounded-t-2xl">
        <h3 class="text-lg font-bold text-white">${title}</h3>
        <button class="modal-close w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="px-6 py-5 text-slate-300 leading-relaxed">${body}</div>
    </div>`;

  const close = () => {
    const content = overlay.querySelector('.modal-content');
    content.style.transform = 'scale(0.95)';
    content.style.opacity = '0';
    setTimeout(() => overlay.remove(), 200);
  };

  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('.modal-backdrop').addEventListener('click', close);

  const escHandler = (e) => {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  root.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    const content = overlay.querySelector('.modal-content');
    content.style.transform = 'scale(1)';
    content.style.opacity = '1';
  });

  return close;
}
