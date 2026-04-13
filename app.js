const tokenKey = 'studyVillageToken';
const apiBase = window.location.origin; // Works for localhost AND production
let authToken = localStorage.getItem(tokenKey);
let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('authForm').addEventListener('submit', submitAuth);
  if (authToken) {
    authenticateUser();
  } else {
    showLogin();
  }
});

function showAuth(mode) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const nameField = document.getElementById('nameField');
  const authName = document.getElementById('authName');
  const authMessage = document.getElementById('authMessage');

  loginTab.classList.toggle('active', mode === 'login');
  registerTab.classList.toggle('active', mode === 'register');
  nameField.style.display = mode === 'register' ? 'grid' : 'none';
  authName.required = mode === 'register';
  authMessage.textContent = '';
  document.getElementById('authForm').dataset.mode = mode;
}

function showLogin() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  showAuth('login');
}

function showApp() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  showPage('dashboard');
  loadUsers();
}

async function submitAuth(event) {
  event.preventDefault();
  const mode = event.target.dataset.mode || 'login';
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const name = document.getElementById('authName').value.trim();
  const message = document.getElementById('authMessage');

  message.textContent = '';
  try {
    if (mode === 'register') {
      if (!name) throw new Error('Bitte Name eingeben.');
      await register(name, email, password);
    } else {
      await login(email, password);
    }
    showApp();
  } catch (err) {
    message.textContent = err.message;
  }
}

async function login(email, password) {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Login fehlgeschlagen');
  }
  setAuthState(payload.user, payload.token);
}

async function register(name, email, password) {
  const response = await fetch(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Registrierung fehlgeschlagen');
  }
  setAuthState(payload.user, payload.token);
}

function setAuthState(user, token) {
  authToken = token;
  currentUser = user;
  localStorage.setItem(tokenKey, token);
  updateProfile();
}

async function authenticateUser() {
  try {
    const response = await fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Nicht authentifiziert');
    }
    currentUser = payload.user;
    updateProfile();
    showApp();
  } catch (err) {
    localStorage.removeItem(tokenKey);
    authToken = null;
    showLogin();
    console.warn('Authentication failed:', err.message);
  }
}

function updateProfile() {
  const initials = currentUser?.name?.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'DU';
  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('sidebarName').textContent = currentUser?.name || 'Gast';
  document.getElementById('dashGreet').textContent = `Willkommen zurück, ${currentUser?.name || 'Lernkrieger'}!`;
  document.getElementById('accountName').textContent = currentUser?.name || '-';
  document.getElementById('accountEmail').textContent = currentUser?.email || '-';
  document.getElementById('accountToken').textContent = authToken ? authToken.slice(0, 24) + '...' : '-';
  document.getElementById('todayTime').textContent = 'Aktiv';
}

function showPage(pageId, element) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
}

async function loadUsers() {
  const container = document.getElementById('userTable');
  container.innerHTML = '<div class="table-row"><div class="table-cell">Lade...</div></div>';
  try {
    const response = await fetch(`${apiBase}/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const users = await response.json();
    if (!response.ok) {
      throw new Error(users.error || 'Fehler beim Laden der Nutzer');
    }
    renderUsers(users);
    updateDashboardStats(users);
  } catch (err) {
    container.innerHTML = `<div class="table-row"><div class="table-cell">${err.message}</div></div>`;
  }
}

function renderUsers(users) {
  if (!Array.isArray(users) || users.length === 0) {
    document.getElementById('userTable').innerHTML = '<div class="table-row"><div class="table-cell">Keine Nutzer gefunden.</div></div>';
    return;
  }
  const rows = users.map(user => `
    <div class="table-row">
      <div class="table-cell">${user.id}</div>
      <div class="table-cell">${user.name}</div>
      <div class="table-cell">${user.email}</div>
    </div>
  `).join('');
  document.getElementById('userTable').innerHTML = `
    <div class="table-row" style="background: rgba(245,200,66,0.08);">
      <div class="table-head">ID</div>
      <div class="table-head">Name</div>
      <div class="table-head">E-Mail</div>
    </div>
    ${rows}
  `;
}

function updateDashboardStats(users) {
  document.getElementById('totalUsers').textContent = users.length.toString();
  document.getElementById('activeUsers').textContent = Math.max(1, users.length).toString();
  const progress = Math.min(100, Math.floor((users.length / 10) * 100));
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressPct').textContent = `${progress} %`;
  document.getElementById('levelBadge').textContent = `LV ${Math.min(6, Math.ceil(users.length / 2))}`;
  document.getElementById('levelDetail').textContent = `Mit ${users.length} Mitgliedern wächst dein Dorf.`;
}

function logout() {
  localStorage.removeItem(tokenKey);
  authToken = null;
  currentUser = null;
  showLogin();
  toast('Logout erfolgreich');
}

function toast(message) {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(window.toastTimeout);
  window.toastTimeout = window.setTimeout(() => toastEl.classList.remove('show'), 3200);
}
