export function renderFooter(container) {
  container.innerHTML = `
    <footer class="border-t border-slate-800 bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <span class="text-sm font-semibold text-slate-400">MediCloud Security Architecture</span>
          </div>
          <div class="text-sm text-slate-500">
            CYBER290 Cloud Security &middot; Yining Liu
          </div>
        </div>
      </div>
    </footer>`;
}
