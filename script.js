// --- Points and Leaderboard Logic ---
const POINTS_PER_REPORT = 10;
const USER_EMAIL = "abiioff565@gmail.com"; // Replace with actual logged-in user

function getUserPoints(email) {
  const points = JSON.parse(localStorage.getItem('userPoints') || '{}');
  return points[email] || 0;
}

function addUserPoints(email, pts) {
  const points = JSON.parse(localStorage.getItem('userPoints') || '{}');
  points[email] = (points[email] || 0) + pts;
  localStorage.setItem('userPoints', JSON.stringify(points));
}

function updateLeaderboard() {
  const points = JSON.parse(localStorage.getItem('userPoints') || '{}');
  const users = Object.entries(points).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  list.innerHTML = users.length ? users.map(([email, pts], i) => `<li><strong>${i+1}.</strong> ${email.split('@')[0]} <span style='color:#2e7d6b;font-weight:600;'>${pts} pts</span></li>`).join('') : '<li>No data yet</li>';
}

function updateUserPointsUI() {
  const el = document.getElementById('userPoints');
  if (el) el.textContent = getUserPoints(USER_EMAIL) + ' points 🎉';
}

// Call on dashboard load
document.addEventListener('DOMContentLoaded', function() {
  updateLeaderboard();
  updateUserPointsUI();
});

// Award points when a report is added (patch report.html and anonymous.html to call this)
function awardPointsOnReport(email) {
  addUserPoints(email, POINTS_PER_REPORT);
  updateLeaderboard();
  updateUserPointsUI();
}
function login(event) {
  event.preventDefault();
  window.location.href = "dashboard.html"; // Redirect after login
}


// Always sync window.reports with localStorage
function syncReportsFromStorage() {
  window.reports = JSON.parse(localStorage.getItem('reports') || '[]');
}
syncReportsFromStorage();

// Listen for storage changes (multi-tab)
window.addEventListener('storage', syncReportsFromStorage);

// If on totalreports.html, render the reports list
if (document.location.pathname.endsWith('totalreports.html')) {
  function renderReports() {
    const section = document.getElementById('reportsListSection');
    if (!window.reports || !window.reports.length) {
      section.innerHTML = '<p>No reports found.</p>';
      return;
    }
    section.innerHTML = window.reports.map(r => `
      <div class="status-card" style="margin-bottom:15px; text-align:left;">
        <h3>${r.title} <span style="float:right;font-size:1rem;color:#3ecf8e;">${r.status.toUpperCase()}</span></h3>
        <p><strong>ID:</strong> ${r.id}</p>
        <p><strong>Description:</strong> ${r.description}</p>
        <p><strong>Community:</strong> ${r.community}</p>
      </div>
    `).join('');
  }
  document.addEventListener('DOMContentLoaded', renderReports);
}

// Count reports by status
function getReportCounts() {
  syncReportsFromStorage();
  // Only count reports with a non-empty category
  const validReports = window.reports.filter(r => r.category && r.category.trim() !== '');
  const total = validReports.length;
  const pending = validReports.filter(r => r.status === 'pending').length;
  const inProgress = validReports.filter(r => r.status === 'in progress' || r.status === 'onprocess').length;
  const resolved = validReports.filter(r => r.status === 'resolved' || r.status === 'completed').length;
  return { total, pending, inProgress, resolved };
}

function updateCounts() {
  const counts = getReportCounts();
  document.getElementById('totalReportsCount').textContent = counts.total;
  document.getElementById('pendingReportsCount').textContent = counts.pending;
  document.getElementById('inProgressReportsCount').textContent = counts.inProgress;
  document.getElementById('resolvedReportsCount').textContent = counts.resolved;
}

function showCount(type) {
  const counts = getReportCounts();
  let text = '';
  switch(type) {
    case 'total':
      text = `Total Reports: ${counts.total}`;
      break;
    case 'pending':
      text = `Pending Reports: ${counts.pending}`;
      break;
    case 'inProgress':
      text = `In Progress Reports: ${counts.inProgress}`;
      break;
    case 'resolved':
      text = `Resolved Reports: ${counts.resolved}`;
      break;
  }
  document.getElementById('reportCountDisplay').textContent = text;
}

document.addEventListener('DOMContentLoaded', function() {
  updateCounts();
  document.getElementById('totalReportsBtn').onclick = () => {
    window.location.href = 'totalreports.html';
  };
  document.getElementById('pendingReportsBtn').onclick = () => {
    window.location.href = 'pending.html';
  };
  document.getElementById('inProgressReportsBtn').onclick = () => {
    window.location.href = 'inprogress.html';
  };
  document.getElementById('resolvedReportsBtn').onclick = () => {
    window.location.href = 'resolved.html';
  };
});
// Initialize the map
var map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India (lat, lng, zoom)

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example marker
var marker = L.marker([13.0827, 80.2707]).addTo(map); // Chennai
marker.bindPopup("<b>Reported Issue</b><br>Pothole in Chennai").openPopup();
// 1. Initialize the map
var map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

// 2. Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Add markers from sample data
const reports = [
  { lat: 13.0827, lng: 80.2707, desc: "Pothole in Chennai" },
  { lat: 12.9716, lng: 77.5946, desc: "Garbage issue in Bangalore" }
];

reports.forEach(r => {
  L.marker([r.lat, r.lng]).addTo(map).bindPopup(r.desc);
});
