import './style.css';
import { initRouter, registerRoute } from './router.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { renderHome } from './pages/Home.js';
import { renderIdentity } from './pages/Identity.js';
import { renderEncryption } from './pages/Encryption.js';
import { renderNetwork } from './pages/Network.js';
import { renderThreatResponse } from './pages/ThreatResponse.js';
import { renderMonitoring } from './pages/Monitoring.js';
import { renderThreatSimulator } from './pages/ThreatSimulator.js';
import { renderZeroTrustPlayground } from './pages/ZeroTrustPlayground.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div id="navbar-mount"></div>
  <main id="page-content" class="pt-16 min-h-screen"></main>
  <div id="footer-mount"></div>
  <div id="modal-root"></div>
`;

renderNavbar(document.getElementById('navbar-mount'));
renderFooter(document.getElementById('footer-mount'));

registerRoute('/', renderHome);
registerRoute('/identity', renderIdentity);
registerRoute('/encryption', renderEncryption);
registerRoute('/network', renderNetwork);
registerRoute('/threat-response', renderThreatResponse);
registerRoute('/monitoring', renderMonitoring);
registerRoute('/simulator', renderThreatSimulator);
registerRoute('/zero-trust', renderZeroTrustPlayground);

initRouter(document.getElementById('page-content'));
