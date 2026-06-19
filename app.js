// World Cup 2026 Predictor - Client Application Logic
// Data Layer: Firebase Realtime Database (real-time sync across all devices)

const REMOTE_MATCHES_API = 'https://worldcup26.ir/get/games';

// MOCK MATCHES FALLBACK DATABASE (Includes Group stage & full Knockout tree matches)
const FALLBACK_MATCHES = [
  // Group Stage Completed Matches
  { id: "1", home_team_name_en: "Mexico", away_team_name_en: "South Africa", home_score: "2", away_score: "0", finished: "TRUE", local_date: "06/11/2026 13:00", group: "A", type: "group", time_elapsed: "finished" },
  { id: "2", home_team_name_en: "South Korea", away_team_name_en: "Czech Republic", home_score: "2", away_score: "1", finished: "TRUE", local_date: "06/11/2026 20:00", group: "A", type: "group", time_elapsed: "finished" },
  { id: "3", home_team_name_en: "Canada", away_team_name_en: "Bosnia & Herzegovina", home_score: "1", away_score: "1", finished: "TRUE", local_date: "06/12/2026 15:00", group: "B", type: "group", time_elapsed: "finished" },
  { id: "4", home_team_name_en: "United States", away_team_name_en: "Paraguay", home_score: "4", away_score: "1", finished: "TRUE", local_date: "06/12/2026 18:00", group: "D", type: "group", time_elapsed: "finished" },
  { id: "5", home_team_name_en: "Haiti", away_team_name_en: "Scotland", home_score: "0", away_score: "1", finished: "TRUE", local_date: "06/13/2026 21:00", group: "C", type: "group", time_elapsed: "finished" },
  { id: "6", home_team_name_en: "Australia", away_team_name_en: "Turkey", home_score: "2", away_score: "0", finished: "TRUE", local_date: "06/13/2026 21:00", group: "D", type: "group", time_elapsed: "finished" },
  { id: "7", home_team_name_en: "Brazil", away_team_name_en: "Morocco", home_score: "1", away_score: "1", finished: "TRUE", local_date: "06/13/2026 18:00", group: "C", type: "group", time_elapsed: "finished" },
  { id: "8", home_team_name_en: "Qatar", away_team_name_en: "Switzerland", home_score: "1", away_score: "1", finished: "TRUE", local_date: "06/13/2026 12:00", group: "B", type: "group", time_elapsed: "finished" },
  { id: "9", home_team_name_en: "Ivory Coast", away_team_name_en: "Ecuador", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/14/2026 19:00", group: "E", type: "group", time_elapsed: "notstarted" },
  { id: "10", home_team_name_en: "Germany", away_team_name_en: "Curaçao", home_score: "7", away_score: "1", finished: "TRUE", local_date: "06/14/2026 12:00", group: "E", type: "group", time_elapsed: "finished" },
  { id: "11", home_team_name_en: "Netherlands", away_team_name_en: "Japan", home_score: "2", away_score: "2", finished: "TRUE", local_date: "06/14/2026 15:00", group: "F", type: "group", time_elapsed: "finished" },
  { id: "12", home_team_name_en: "Sweden", away_team_name_en: "Tunisia", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/14/2026 20:00", group: "F", type: "group", time_elapsed: "notstarted" },
  
  // Matches for TODAY: June 15, 2026
  { id: "14", home_team_name_en: "Spain", away_team_name_en: "Cape Verde", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/15/2026 12:00", group: "H", type: "group", time_elapsed: "notstarted" },
  { id: "15", home_team_name_en: "Belgium", away_team_name_en: "Egypt", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/15/2026 12:00", group: "G", type: "group", time_elapsed: "notstarted" },
  { id: "16", home_team_name_en: "Saudi Arabia", away_team_name_en: "Uruguay", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/15/2026 18:00", group: "H", type: "group", time_elapsed: "notstarted" },
  { id: "13", home_team_name_en: "Iran", away_team_name_en: "New Zealand", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/15/2026 18:00", group: "G", type: "group", time_elapsed: "notstarted" },
  
  // Future Group Matches
  { id: "17", home_team_name_en: "France", away_team_name_en: "Senegal", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/16/2026 15:00", group: "I", type: "group", time_elapsed: "notstarted" },
  { id: "18", home_team_name_en: "Iraq", away_team_name_en: "Norway", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/16/2026 18:00", group: "I", type: "group", time_elapsed: "notstarted" },
  { id: "19", home_team_name_en: "Argentina", away_team_name_en: "Algeria", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/16/2026 20:00", group: "J", type: "group", time_elapsed: "notstarted" },
  { id: "21", home_team_name_en: "Portugal", away_team_name_en: "DR Congo", home_score: "0", away_score: "0", finished: "FALSE", local_date: "06/17/2026 12:00", group: "K", type: "group", time_elapsed: "notstarted" },

  // Knockout Matches (R16)
  { id: "89", home_team_name_en: "Spain", away_team_name_en: "Germany", home_score: "2", away_score: "1", finished: "TRUE", local_date: "07/04/2026 12:00", group: "R16", type: "r16", time_elapsed: "finished" },
  { id: "90", home_team_name_en: "Argentina", away_team_name_en: "Japan", home_score: "3", away_score: "1", finished: "TRUE", local_date: "07/04/2026 17:00", group: "R16", type: "r16", time_elapsed: "finished" },
  { id: "91", home_team_name_en: "Portugal", away_team_name_en: "Morocco", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/05/2026 12:00", group: "R16", type: "r16", time_elapsed: "notstarted" },
  { id: "92", home_team_name_en: "England", away_team_name_en: "Mexico", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/05/2026 18:00", group: "R16", type: "r16", time_elapsed: "notstarted" },
  { id: "93", home_team_name_en: "France", away_team_name_en: "Australia", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/06/2026 12:00", group: "R16", type: "r16", time_elapsed: "notstarted" },
  { id: "94", home_team_name_en: "Brazil", away_team_name_en: "United States", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/06/2026 17:00", group: "R16", type: "r16", time_elapsed: "notstarted" },
  { id: "95", home_team_name_en: "Belgium", away_team_name_en: "South Korea", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/07/2026 12:00", group: "R16", type: "r16", time_elapsed: "notstarted" },
  { id: "96", home_team_name_en: "Netherlands", away_team_name_en: "Sweden", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/07/2026 17:00", group: "R16", type: "r16", time_elapsed: "notstarted" },

  // Quarter-Finals (QF)
  { id: "97", home_team_name_en: "Spain", away_team_name_en: "Argentina", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/10/2026 12:00", group: "QF", type: "qf", time_elapsed: "notstarted" },
  { id: "98", home_team_name_en: "Winner Match 91", away_team_name_en: "Winner Match 92", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/10/2026 17:00", group: "QF", type: "qf", time_elapsed: "notstarted" },
  { id: "99", home_team_name_en: "Winner Match 93", away_team_name_en: "Winner Match 94", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/11/2026 12:00", group: "QF", type: "qf", time_elapsed: "notstarted" },
  { id: "100", home_team_name_en: "Winner Match 95", away_team_name_en: "Winner Match 96", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/11/2026 17:00", group: "QF", type: "qf", time_elapsed: "notstarted" },

  // Semi-Finals (SF)
  { id: "101", home_team_name_en: "Winner Match 97", away_team_name_en: "Winner Match 98", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/14/2026 15:00", group: "SF", type: "sf", time_elapsed: "notstarted" },
  { id: "102", home_team_name_en: "Winner Match 99", away_team_name_en: "Winner Match 100", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/15/2026 15:00", group: "SF", type: "sf", time_elapsed: "notstarted" },

  // Grand Final
  { id: "104", home_team_name_en: "Winner Match 101", away_team_name_en: "Winner Match 102", home_score: "0", away_score: "0", finished: "FALSE", local_date: "07/19/2026 15:00", group: "FINAL", type: "final", time_elapsed: "notstarted" }
];

// Employee ID to Name mapping (uses global G_EMPLOYEE_MAP loaded from employee_map.js if available)
let EMPLOYEE_MAP = typeof G_EMPLOYEE_MAP !== 'undefined' ? G_EMPLOYEE_MAP : {
  "20027854": "อนุสรณ์ อัญญมณีกุล",
  "20027855": "สมชาย รักดี",
  "20027856": "สมศรี มีชัย",
  "20027857": "วิภาวรรณ สวยงาม",
  "20027858": "กิตติพงษ์ เรียนดี",
  "20027859": "ณัฐพล แก้วมณี",
  "20027860": "ปิยะนันท์ รุ่งเรือง"
};


// Country ISO-3166-1 alpha-2 mapping for FlagCDN
const ISO_MAP = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czech Republic": "cz",
  "Canada": "ca", "Bosnia & Herzegovina": "ba", "Bosnia and Herzegovina": "ba",
  "Qatar": "qa", "Switzerland": "ch", "United States": "us", "Paraguay": "py",
  "Haiti": "ht", "Scotland": "gb-sct", "Australia": "au", "Turkey": "tr",
  "Brazil": "br", "Morocco": "ma", "Ivory Coast": "ci", "Ecuador": "ec",
  "Germany": "de", "Curaçao": "cw", "Netherlands": "nl", "Japan": "jp",
  "Sweden": "se", "Tunisia": "tn", "Spain": "es", "Cape Verde": "cv",
  "Belgium": "be", "Egypt": "eg", "Saudi Arabia": "sa", "Uruguay": "uy",
  "Iran": "ir", "New Zealand": "nz", "France": "fr", "Senegal": "sn",
  "Iraq": "iq", "Norway": "no", "Argentina": "ar", "Algeria": "dz",
  "Portugal": "pt", "Democratic Republic of the Congo": "cd", "DR Congo": "cd",
  "England": "gb-eng", "Croatia": "hr", "Jordan": "jo", "Austria": "at",
  "Colombia": "co", "Uzbekistan": "uz", "Panama": "pa", "Ghana": "gh", "Italy": "it"
};

// Global App State
let state = {
  currentUser: null,
  matches: [],
  predictions: [],
  leaderboardMode: 'global',
  leaderboard: [],
  firebaseListeners: []  // store refs for cleanup on logout
};

// Helper: Get Flag HTML tag (with FlagCDN and image fallback)
function getFlag(teamName) {
  if (!teamName) return '<span class="flag-placeholder">🏳️</span>';
  const trimmed = teamName.trim();
  
  // Dynamic placeholders in brackets (e.g. Winner Match 91)
  if (trimmed.startsWith("Winner Match") || trimmed.startsWith("Winner match")) {
    return '<span class="flag-placeholder"><i class="fa-solid fa-trophy text-warning" style="font-size: 0.85em;"></i></span>';
  }
  
  const code = ISO_MAP[trimmed] || ISO_MAP[teamName];
  if (code) {
    return `<img class="flag-img" src="https://flagcdn.com/w80/${code.toLowerCase()}.png" alt="${trimmed}" onerror="this.onerror=null; this.src='https://flagcdn.com/w80/un.png';">`;
  }
  return '<span class="flag-placeholder">🏳️</span>';
}

// Helper: Resolve employee name from nickname in case it was saved as "พนักงาน (รหัส)" or has formatting variations
function resolveEmployeeName(nickname) {
  if (!nickname) return "";
  if (nickname.startsWith("พนักงาน (") && nickname.endsWith(")")) {
    const empId = nickname.substring(9, nickname.length - 1);
    if (EMPLOYEE_MAP[empId]) {
      return EMPLOYEE_MAP[empId];
    }
  }
  
  // Normalization helper: strips spaces and normalizes character variants (e.g., ฎ vs ฏ)
  const norm = (s) => s.replace(/\s+/g, '').replace(/ฎ/g, 'ฏ');
  const normalizedNickname = norm(nickname);
  
  // Try to find matching employee name by normalized value to return the properly formatted name
  const matchedId = Object.keys(EMPLOYEE_MAP).find(key => norm(EMPLOYEE_MAP[key]) === normalizedNickname);
  if (matchedId) {
    return EMPLOYEE_MAP[matchedId];
  }

  // Check if nickname itself is an employee ID
  if (EMPLOYEE_MAP[nickname]) {
    return EMPLOYEE_MAP[nickname];
  }
  return nickname;
}

// ── FIREBASE HELPERS ─────────────────────────────────────────────────────────

// Initialize network status indicator
function initNetworkStatus() {
  const statusEl = document.getElementById('network-status');
  const connRef = db_firebase.ref('.info/connected');
  connRef.on('value', snap => {
    if (snap.val() === true) {
      statusEl.innerHTML = `<i class="fa-solid fa-fire text-success"></i> Connected · Firebase Real-time Sync`;
      statusEl.className = "mode-indicator text-success";
    } else {
      statusEl.innerHTML = `<i class="fa-solid fa-cloud-arrow-up text-warning animate-pulse"></i> กำลังเชื่อมต่อ Firebase...`;
      statusEl.className = "mode-indicator text-warning";
    }
  });
}

// Recalculate scores for a user based on all predictions vs match results
async function firebaseRecalculateUserPoints(userId) {
  const [predsSnap, matchesSnap] = await Promise.all([
    db_firebase.ref(`predictions/${userId}`).get(),
    db_firebase.ref('matches').get()
  ]);

  const preds = predsSnap.exists() ? Object.values(predsSnap.val()) : [];
  const matches = matchesSnap.exists() ? Object.values(matchesSnap.val()) : [];
  const matchMap = {};
  matches.forEach(m => { matchMap[m.id] = m; });

  let points = 0;
  preds.forEach(pred => {
    const match = matchMap[pred.matchId];
    if (match && match.finished === "TRUE") {
      const mh = parseInt(match.home_score);
      const ma = parseInt(match.away_score);
      const ph = parseInt(pred.homeScore);
      const pa = parseInt(pred.awayScore);
      if (isNaN(mh) || isNaN(ma) || isNaN(ph) || isNaN(pa)) return;
      if (mh === ph && ma === pa) {
        points += 3;
      } else if (Math.sign(mh - ma) === Math.sign(ph - pa)) {
        points += 1;
      }
    }
  });
  return points;
}

// Recalculate and save points for ALL users (called by admin after match update)
async function firebaseRecalculateAllPoints() {
  const usersSnap = await db_firebase.ref('users').get();
  if (!usersSnap.exists()) return;
  const users = usersSnap.val();
  const updates = {};
  for (const empId of Object.keys(users)) {
    const pts = await firebaseRecalculateUserPoints(empId);
    updates[`users/${empId}/points`] = pts;
  }
  await db_firebase.ref().update(updates);
}

// ── FIREBASE REAL-TIME LISTENERS ─────────────────────────────────────────────

// Start listening to match updates in real-time
function startMatchListener() {
  const ref = db_firebase.ref('matches');
  const handler = snap => {
    if (snap.exists()) {
      state.matches = Object.values(snap.val());
    } else {
      // First run: seed matches from FALLBACK_MATCHES
      state.matches = FALLBACK_MATCHES;
      const matchMap = {};
      FALLBACK_MATCHES.forEach(m => { matchMap[m.id] = m; });
      db_firebase.ref('matches').set(matchMap);
    }
    populateDateFilter();
    renderNextMatch();
    renderRecentMatches();
    renderPredictionList();
    renderBracket();
    populateAdminMatchSelect();
  };
  ref.on('value', handler);
  state.firebaseListeners.push({ ref, handler });
}

// Start listening to leaderboard (all users) in real-time
function startLeaderboardListener() {
  const ref = db_firebase.ref('users');
  const handler = snap => {
    if (!snap.exists()) {
      state.leaderboard = [];
    } else {
      state.leaderboard = Object.values(snap.val());
      state.leaderboard.sort((a, b) => b.points - a.points || (a.nickname || '').localeCompare(b.nickname || ''));
    }
    renderLeaderboard();
    // Update my score display
    if (state.currentUser) {
      const me = state.leaderboard.find(u => u.employeeId === state.currentUser.employeeId);
      if (me) {
        state.currentUser.points = me.points;
        document.getElementById('user-display-score').innerText = me.points;
      }
    }
  };
  ref.on('value', handler);
  state.firebaseListeners.push({ ref, handler });
}

// Start listening to current user's predictions in real-time
function startPredictionListener(empId) {
  const ref = db_firebase.ref(`predictions/${empId}`);
  const handler = snap => {
    state.predictions = snap.exists() ? Object.values(snap.val()) : [];
    renderPredictionList();
  };
  ref.on('value', handler);
  state.firebaseListeners.push({ ref, handler });
}

// Detach all Firebase listeners (called on logout)
function stopAllListeners() {
  state.firebaseListeners.forEach(({ ref, handler }) => ref.off('value', handler));
  state.firebaseListeners = [];
}

// API INTERACTION FUNCTIONS
async function fetchMatches() {
  // Matches are now handled by the real-time listener startMatchListener()
  // This function is kept for compatibility with tab-switch refresh calls
  populateDateFilter();
  renderNextMatch();
  renderRecentMatches();
  renderPredictionList();
  renderBracket();
  populateAdminMatchSelect();
}

async function fetchLeaderboard() {
  // Leaderboard is now handled by the real-time listener startLeaderboardListener()
  // This function renders from the already-updated state.leaderboard
  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;

  container.innerHTML = '';
  if (!Array.isArray(state.leaderboard) || state.leaderboard.length === 0) {
    container.innerHTML = `<div class="loading-placeholder">ยังไม่มีข้อมูลตารางคะแนน</div>`;
    return;
  }
  
  state.leaderboard.forEach((player, index) => {
    const rank = index + 1;
    const isMeClass = state.currentUser && player.employeeId === state.currentUser.employeeId ? 'me' : '';
    
    const empId = player.employeeId || "";
    
    let rankBadge = `<span>No. ${rank}</span>`;
    if (rank === 1) rankBadge = `<span class="rank-badge gold"><i class="fa-solid fa-trophy"></i> 1</span>`;
    else if (rank === 2) rankBadge = `<span class="rank-badge silver"><i class="fa-solid fa-medal"></i> 2</span>`;
    else if (rank === 3) rankBadge = `<span class="rank-badge bronze"><i class="fa-solid fa-medal"></i> 3</span>`;
    
    const item = document.createElement('div');
    item.className = `leaderboard-item ${isMeClass} animate-fade-in`;
    item.innerHTML = `
      <span class="col-rank">${rankBadge}</span>
      <span class="col-id">${empId || '-'}</span>
      <span class="col-name">${resolveEmployeeName(player.nickname)}</span>
      <span class="col-team"><span class="li-team">${player.teamCode}</span></span>
      <span class="col-score text-accent font-bold">${player.points} แต้ม</span>
    `;
    container.appendChild(item);
  });
}

async function fetchUserPredictions() {
  // Predictions are now handled by the real-time listener startPredictionListener()
  // This function is kept for compatibility
  renderPredictionList();
}

// Submit score prediction (Save to Firebase)
async function submitPrediction(matchId, homeScore, awayScore) {
  if (!state.currentUser) return;
  const empId = state.currentUser.employeeId;
  const predObj = { userId: empId, matchId, homeScore, awayScore };
  await db_firebase.ref(`predictions/${empId}/${matchId}`).set(predObj);
  // Recalculate and update this user's points
  const pts = await firebaseRecalculateUserPoints(empId);
  await db_firebase.ref(`users/${empId}/points`).set(pts);
}

// RENDERING LOGIC

// 1. Render NEXT MATCH (Real-time View)
function renderNextMatch() {
  const container = document.getElementById('next-match-card-container');
  const countdownEl = document.getElementById('next-match-countdown');
  const now = new Date();
  
  const upcoming = state.matches
    .filter(m => m.finished === "FALSE")
    .map(m => {
      const parts = m.local_date.split(' ');
      const dateParts = parts[0].split('/');
      const timeParts = parts[1].split(':');
      const dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
      return { ...m, timeStamp: dateObj.getTime() };
    })
    .filter(m => m.timeStamp > now.getTime())
    .sort((a, b) => a.timeStamp - b.timeStamp);
    
  if (upcoming.length === 0) {
    if (container) {
      container.innerHTML = `
        <div class="hero-match-card text-center">
          <p>ไม่มีการแข่งขันถัดไปในระบบ</p>
        </div>
      `;
    }
    if (countdownEl) countdownEl.innerText = "ทัวร์นาเมนต์จบแล้ว";
    return;
  }
  
  const nextMatch = upcoming[0];
  const homeFlag = getFlag(nextMatch.home_team_name_en || nextMatch.home_team_label);
  const awayFlag = getFlag(nextMatch.away_team_name_en || nextMatch.away_team_label);
  
  const userPred = state.predictions.find(p => p.matchId === nextMatch.id);
  const predText = userPred 
    ? `คำทำนายของคุณ: ${userPred.homeScore} - ${userPred.awayScore}`
    : `<span class="text-warning"><i class="fa-solid fa-triangle-exclamation"></i> ยังไม่ได้ทำนายผลคู่นี้!</span>`;
    
  if (container) {
    container.innerHTML = `
      <div class="hero-match-card animate-fade-in">
        <div class="match-meta-top">
          <span>รอบ: ${nextMatch.group ? `กลุ่ม ${nextMatch.group}` : 'น็อคเอาท์'}</span>
          <span>${nextMatch.local_date}</span>
        </div>
        
        <div class="match-teams-vs">
          <div class="team-display">
            <span class="team-flag">${homeFlag}</span>
            <span class="team-name">${nextMatch.home_team_name_en || nextMatch.home_team_label || 'TBD'}</span>
          </div>
          
          <div class="match-vs-col">
            <span class="vs-badge">VS</span>
          </div>
          
          <div class="team-display">
            <span class="team-flag">${awayFlag}</span>
            <span class="team-name">${nextMatch.away_team_name_en || nextMatch.away_team_label || 'TBD'}</span>
          </div>
        </div>
        
        <div class="match-meta-bottom">
          <div><i class="fa-solid fa-pen-to-square"></i> ${predText}</div>
        </div>
      </div>
    `;
  }
  
  if (countdownEl) {
    const diff = nextMatch.timeStamp - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      countdownEl.innerText = `อีก ${Math.floor(hours/24)} วัน`;
    } else {
      countdownEl.innerText = `เริ่มในอีก ${hours} ชม. ${mins} นาที`;
    }
  }
}

// 2. Render RECENT MATCHES
function renderRecentMatches() {
  const container = document.getElementById('recent-matches-container');
  if (!container) return;
  
  const finished = state.matches
    .filter(m => m.finished === "TRUE")
    .map(m => {
      const parts = m.local_date.split(' ');
      const dateParts = parts[0].split('/');
      const timeParts = parts[1].split(':');
      const dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
      return { ...m, timeStamp: dateObj.getTime() };
    })
    .sort((a, b) => b.timeStamp - a.timeStamp);
    
  container.innerHTML = '';
  if (finished.length === 0) {
    container.innerHTML = `<div class="loading-placeholder">ยังไม่มีแมตช์ที่เสร็จสิ้น</div>`;
    return;
  }
  
  finished.forEach(m => {
    const homeFlag = getFlag(m.home_team_name_en || m.home_team_label);
    const awayFlag = getFlag(m.away_team_name_en || m.away_team_label);
    
    let pointsAwarded = '';
    const userPred = state.predictions.find(p => p.matchId === m.id);
    if (userPred) {
      const matchHome = parseInt(m.home_score);
      const matchAway = parseInt(m.away_score);
      const predHome = parseInt(userPred.homeScore);
      const predAway = parseInt(userPred.awayScore);
      
      if (matchHome === predHome && matchAway === predAway) {
        pointsAwarded = `<span class="badge badge-success">+3 (เป๊ะ!)</span>`;
      } else {
        const matchResult = Math.sign(matchHome - matchAway);
        const predResult = Math.sign(predHome - predAway);
        if (matchResult === predResult) {
          pointsAwarded = `<span class="badge badge-success">+1</span>`;
        } else {
          pointsAwarded = `<span class="badge badge-danger">0</span>`;
        }
      }
    } else {
      pointsAwarded = `<span class="badge badge-warning">ไม่ได้ทาย</span>`;
    }
    
    const item = document.createElement('div');
    item.className = 'match-item-compact animate-fade-in';
    item.innerHTML = `
      <span class="mic-round">${m.group ? `กลุ่ม ${m.group}` : 'Knockout'}</span>
      <div class="mic-teams">
        <span>${homeFlag} ${m.home_team_name_en || m.home_team_label || 'TBD'}</span>
        <span style="color:var(--text-muted);">vs</span>
        <span>${awayFlag} ${m.away_team_name_en || m.away_team_label || 'TBD'}</span>
      </div>
      <div class="mic-score-box">
        <span class="mic-score">${m.home_score} - ${m.away_score}</span>
      </div>
      <div class="mic-status">${pointsAwarded}</div>
    `;
    container.appendChild(item);
  });
}

// Helper: Get unique match dates sorted chronologically
function getUniqueMatchDates() {
  const dates = new Set();
  state.matches.forEach(m => {
    if (m.local_date) {
      const datePart = m.local_date.split(' ')[0];
      dates.add(datePart);
    }
  });
  return Array.from(dates).sort((a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return da - db;
  });
}

// Helper: Format date string to Thai readable format
function formatThaiDate(dateStr) {
  const monthsThai = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[1]);
    const monthIndex = parseInt(parts[0]) - 1;
    const year = parseInt(parts[2]);
    return `${day} ${monthsThai[monthIndex]} ${year}`;
  }
  return dateStr;
}

// Populate Date Filter Dropdown dynamically
function populateDateFilter() {
  const select = document.getElementById('match-filter-date');
  if (!select) return;
  
  const previousSelection = select.value;
  select.innerHTML = '';
  
  const dates = getUniqueMatchDates();
  if (dates.length === 0) {
    select.innerHTML = '<option value="">ไม่มีวันที่แข่งขัน</option>';
    return;
  }
  
  const now = new Date();
  const todayDateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  
  let defaultDate = '';
  
  dates.forEach(date => {
    const opt = document.createElement('option');
    opt.value = date;
    
    let label = formatThaiDate(date);
    if (date === todayDateStr) {
      label += ' (วันนี้)';
    }
    
    opt.innerText = label;
    select.appendChild(opt);
  });
  
  // 1. If today is in the match dates list, default to today
  if (dates.includes(todayDateStr)) {
    defaultDate = todayDateStr;
  } else {
    // 2. Otherwise, find the first date that has unfinished matches
    const unfinishedMatches = state.matches.filter(m => m.finished === "FALSE");
    if (unfinishedMatches.length > 0) {
      unfinishedMatches.sort((a, b) => {
        const getTimestamp = (mStr) => {
          const p = mStr.split(' ');
          const dp = p[0].split('/');
          const tp = p[1].split(':');
          return new Date(dp[2], dp[0] - 1, dp[1], tp[0], tp[1]).getTime();
        };
        return getTimestamp(a.local_date) - getTimestamp(b.local_date);
      });
      defaultDate = unfinishedMatches[0].local_date.split(' ')[0];
    }
  }
  
  // 3. Fallback to the first date if still no defaultDate
  if (!defaultDate || !dates.includes(defaultDate)) {
    defaultDate = dates[0];
  }
  
  if (previousSelection && dates.includes(previousSelection)) {
    select.value = previousSelection;
  } else {
    select.value = defaultDate;
  }
}

// 3. Render PREDICTIONS LIST
function renderPredictionList() {
  const container = document.getElementById('prediction-matches-container');
  if (!container) return;
  
  const dateFilterEl = document.getElementById('match-filter-date');
  if (!dateFilterEl) return;
  const selectedDate = dateFilterEl.value;
  
  const showPredictedEl = document.getElementById('match-filter-show-predicted');
  const showPredicted = showPredictedEl ? showPredictedEl.checked : false;
  
  container.innerHTML = '';
  const now = new Date().getTime();
  const nowObj = new Date();
  const todayDateStr = `${String(nowObj.getMonth() + 1).padStart(2, '0')}/${String(nowObj.getDate()).padStart(2, '0')}/${nowObj.getFullYear()}`;
  
  // Filter matches
  let filtered = state.matches.filter(m => {
    // 1. Date match
    if (!m.local_date) return false;
    const matchDatePart = m.local_date.split(' ')[0];
    if (matchDatePart !== selectedDate) return false;
    
    // Parse match time to check if started or finished
    const parts = m.local_date.split(' ');
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');
    const dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
    const isStartedOrFinished = m.finished === "TRUE" || dateObj.getTime() < now;
    
    // Check if predicted
    const myPred = state.predictions.find(p => p.matchId === m.id);
    const hasPrediction = !!myPred;
    
    // 2. Hide predicted matches if toggle is unchecked
    if (!showPredicted && hasPrediction) {
      return false;
    }
    
    // 3. Hide started/finished matches if toggle is unchecked
    if (!showPredicted && isStartedOrFinished) {
      return false;
    }
    
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div class="loading-placeholder">ไม่มีการแข่งขันที่ยังไม่ได้ทายสำหรับวันนี้</div>`;
    return;
  }
  
  // Sort chronologically by time
  filtered.sort((a, b) => {
    const getTimestamp = (mStr) => {
      const p = mStr.split(' ');
      const dp = p[0].split('/');
      const tp = p[1].split(':');
      return new Date(dp[2], dp[0] - 1, dp[1], tp[0], tp[1]).getTime();
    };
    return getTimestamp(a.local_date) - getTimestamp(b.local_date);
  });

  filtered.forEach(m => {
    const homeTeam = m.home_team_name_en || m.home_team_label || 'TBD';
    const awayTeam = m.away_team_name_en || m.away_team_label || 'TBD';
    const homeFlag = getFlag(m.home_team_name_en || m.home_team_label);
    const awayFlag = getFlag(m.away_team_name_en || m.away_team_label);
    
    const parts = m.local_date.split(' ');
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');
    const dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
    
    const matchDatePart = parts[0];
    const isToday = matchDatePart === todayDateStr;
    const canPredict = isToday && m.finished !== "TRUE" && dateObj.getTime() >= now;
    const isLocked = !canPredict;
    const isOtherDayUnfinished = !isToday && m.finished !== "TRUE";
    
    const myPred = state.predictions.find(p => p.matchId === m.id);
    const predHome = myPred ? myPred.homeScore : '';
    const predAway = myPred ? myPred.awayScore : '';
    
    const disabledAttr = isLocked ? 'disabled' : '';
    
    let statusText = '';
    let cardFeedback = '';
    
    if (m.finished === "TRUE") {
      statusText = `<span class="badge badge-success">จบเกม: ${m.home_score} - ${m.away_score}</span>`;
      if (myPred) {
        const mh = parseInt(m.home_score);
        const ma = parseInt(m.away_score);
        const ph = parseInt(predHome);
        const pa = parseInt(predAway);
        if (mh === ph && ma === pa) {
          cardFeedback = `<span class="badge badge-success pc-feedback-badge"><i class="fa-solid fa-circle-check"></i> ตรงเป๊ะ (+3)</span>`;
        } else if (Math.sign(mh - ma) === Math.sign(ph - pa)) {
          cardFeedback = `<span class="badge badge-success pc-feedback-badge" style="background-color:rgba(16,185,129,0.1)"><i class="fa-solid fa-check"></i> ถูกผล (+1)</span>`;
        } else {
          cardFeedback = `<span class="badge badge-danger pc-feedback-badge"><i class="fa-solid fa-circle-xmark"></i> ผิด (0)</span>`;
        }
      } else {
        cardFeedback = `<span class="badge badge-warning pc-feedback-badge">ไม่ทาย (0)</span>`;
      }
    } else if (isOtherDayUnfinished) {
      statusText = `<span class="badge badge-secondary">ยังไม่ถึงเวลาการทายผล</span>`;
      cardFeedback = `<span class="text-muted"><i class="fa-solid fa-calendar"></i> ยังไม่เปิดรับทาย</span>`;
    } else if (m.finished !== "TRUE" && dateObj.getTime() < now) {
      statusText = `<span class="badge badge-danger">Locked</span>`;
      cardFeedback = `<span class="text-danger"><i class="fa-solid fa-lock"></i> ปิดรับทาย</span>`;
    } else {
      statusText = `<span class="badge badge-warning">เปิดทาย</span>`;
      cardFeedback = myPred 
        ? `<span class="text-success"><i class="fa-solid fa-circle-check"></i> บันทึกแล้ว</span>`
        : `<span class="text-warning"><i class="fa-solid fa-circle-exclamation"></i> รอทายผล</span>`;
    }

    const card = document.createElement('div');
    card.className = 'prediction-card animate-fade-in';
    card.innerHTML = `
      <div class="pc-top">
        <span>รอบ: ${m.group ? `กลุ่ม ${m.group}` : 'Knockout'}</span>
        <span>${m.local_date}</span>
      </div>
      
      <div class="pc-row">
        <div class="pc-team">
          <span class="pc-flag">${homeFlag}</span>
          <span>${homeTeam}</span>
        </div>
        
        <div class="pc-inputs">
          <input type="number" class="score-input pred-home" data-match-id="${m.id}" min="0" value="${predHome}" ${disabledAttr}>
          <span class="pc-dash">-</span>
          <input type="number" class="score-input pred-away" data-match-id="${m.id}" min="0" value="${predAway}" ${disabledAttr}>
        </div>
        
        <div class="pc-team away">
          <span class="pc-flag">${awayFlag}</span>
          <span>${awayTeam}</span>
        </div>
      </div>
      
      <div class="pc-bottom">
        <div class="pc-status-col">
          <div class="pc-status-label">${statusText}</div>
          <div class="pc-feedback-status">${cardFeedback}</div>
        </div>
        <div class="pc-action-col">
          ${isLocked ? '' : `<button class="btn btn-primary btn-sm save-pred-btn" data-match-id="${m.id}"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>`}
        </div>
      </div>
    `;
    
    if (!isLocked) {
      const saveBtn = card.querySelector('.save-pred-btn');
      saveBtn.addEventListener('click', async (e) => {
        const matchId = e.currentTarget.getAttribute('data-match-id');
        const homeVal = card.querySelector('.pred-home').value;
        const awayVal = card.querySelector('.pred-away').value;
        
        if (homeVal === '' || awayVal === '') {
          alert("กรุณากรอกคะแนนทายผลให้ครบถ้วนก่อนกดบันทึก!");
          return;
        }
        
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...`;
        
        try {
          await submitPrediction(matchId, parseInt(homeVal), parseInt(awayVal));
          await fetchUserPredictions();
        } catch (err) {
          console.error(err);
          alert("ล้มเหลวในการบันทึกคำทำนาย!");
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> บันทึก`;
        }
      });
    }
    
    container.appendChild(card);
  });
}

// 4. Render BRACKET TREE DIAGRAM
function renderBracket() {
  const rounds = {
    'r16': document.getElementById('bracket-r16-list'),
    'qf': document.getElementById('bracket-qf-list'),
    'sf': document.getElementById('bracket-sf-list'),
    'final': document.getElementById('bracket-final-list')
  };
  
  if (!rounds.r16) return; // Bracket view element not loaded
  
  // Clear lists
  Object.values(rounds).forEach(el => { if (el) el.innerHTML = ''; });
  
  state.matches.forEach(m => {
    const rType = m.type ? m.type.toLowerCase() : '';
    const container = rounds[rType];
    
    if (container) {
      const homeFlag = getFlag(m.home_team_name_en || m.home_team_label);
      const awayFlag = getFlag(m.away_team_name_en || m.away_team_label);
      
      const hs = parseInt(m.home_score);
      const as = parseInt(m.away_score);
      const isFin = m.finished === "TRUE";
      
      const winnerHomeClass = isFin && hs > as ? 'winner' : '';
      const winnerAwayClass = isFin && as > hs ? 'winner' : '';
      
      const node = document.createElement('div');
      node.className = 'bracket-match-node animate-fade-in';
      node.innerHTML = `
        <div class="bracket-match-id">Match ${m.id}</div>
        
        <div class="bracket-team-row ${winnerHomeClass}">
          <div class="bracket-team-info">
            <span class="bracket-team-flag">${homeFlag}</span>
            <span>${m.home_team_name_en || m.home_team_label || 'TBD'}</span>
          </div>
          <div class="bracket-team-score">${isFin || hs > 0 || as > 0 ? hs : '-'}</div>
        </div>
        
        <div class="bracket-team-row ${winnerAwayClass}">
          <div class="bracket-team-info">
            <span class="bracket-team-flag">${awayFlag}</span>
            <span>${m.away_team_name_en || m.away_team_label || 'TBD'}</span>
          </div>
          <div class="bracket-team-score">${isFin || hs > 0 || as > 0 ? as : '-'}</div>
        </div>
      `;
      container.appendChild(node);
    }
  });
}

function populateAdminMatchSelect() {
  const select = document.getElementById('admin-select-match');
  if (!select) return;
  select.innerHTML = '<option value="">-- เลือกคู่แข่งขัน --</option>';
  
  const sorted = [...state.matches].sort((a, b) => parseInt(a.id) - parseInt(b.id));
  sorted.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.innerText = `[Match ${m.id} - ${m.group || m.type}] ${m.home_team_name_en || m.home_team_label || 'TBD'} vs ${m.away_team_name_en || m.away_team_label || 'TBD'}`;
    select.appendChild(opt);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// INITIALIZATION & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
  // Load employee mapping from json database if not already loaded via script tag
  if (typeof G_EMPLOYEE_MAP === 'undefined') {
    try {
      const empRes = await fetch('employee_map.json');
      if (empRes.ok) {
        const parsedMap = await empRes.json();
        EMPLOYEE_MAP = { ...EMPLOYEE_MAP, ...parsedMap };
        console.log(`Loaded ${Object.keys(parsedMap).length} employees from database.`);
      }
    } catch (err) {
      console.warn("Could not load employee_map.json, using local default fallback registry.", err);
    }
  } else {
    console.log(`Using preloaded G_EMPLOYEE_MAP with ${Object.keys(EMPLOYEE_MAP).length} employees.`);
  }

  // Initialize Firebase connection status and start listening to match data
  initNetworkStatus();
  startMatchListener();
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const empId = document.getElementById('employee-id').value.trim();
      const teamCode = document.getElementById('team-code').value.trim().toUpperCase();
      
      if (!empId || !teamCode) {
        throw new Error("Employee ID and Team Code are required!");
      }
      
      const nickname = EMPLOYEE_MAP[empId];
      if (!nickname) {
        throw new Error("ไม่พบรหัสพนักงานนี้ในระบบ หรือกรอกไม่ถูกต้อง กรุณากรอกรหัสพนักงานให้ถูกต้อง");
      }

      // Upsert user in Firebase (employeeId is the key)
      const userRef = db_firebase.ref(`users/${empId}`);
      const snap = await userRef.get();
      let user;
      if (snap.exists()) {
        user = snap.val();
        // Update teamCode and nickname in case they changed
        await userRef.update({ teamCode, nickname });
        user.teamCode = teamCode;
        user.nickname = nickname;
      } else {
        user = { id: empId, nickname, teamCode, employeeId: empId, points: 0 };
        await userRef.set(user);
      }
      state.currentUser = user;
      
      // Update UI
      document.getElementById('user-display-name').innerText = resolveEmployeeName(nickname);
      document.getElementById('user-display-team').innerHTML = `<i class="fa-solid fa-users"></i> TEAM: ${teamCode}`;
      document.getElementById('user-display-score').innerText = user.points || 0;
      
      const teamCodeBadge = document.getElementById('team-code-badge');
      if (teamCodeBadge) teamCodeBadge.innerText = `(${teamCode})`;
      
      // Hide/Show Admin Tab based on Employee ID
      const adminTabBtn = document.querySelector('.tab-btn[data-target="admin"]');
      if (adminTabBtn) {
        adminTabBtn.style.display = (empId === '20027854') ? 'flex' : 'none';
      }
      
      // Start real-time Firebase listeners
      startLeaderboardListener();
      startPredictionListener(empId);
      
      document.getElementById('login-screen').classList.remove('active');
      document.getElementById('main-screen').classList.add('active');
      renderBracket();
      
    } catch (err) {
      console.error("Login Form Submission Error:", err);
      alert("ไม่สามารถเข้าสู่ระบบได้: " + err.message);
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    // Stop all Firebase real-time listeners
    stopAllListeners();
    state.currentUser = null;
    state.predictions = [];
    state.leaderboard = [];
    
    // Hide Admin Tab on logout
    const adminTabBtn = document.querySelector('.tab-btn[data-target="admin"]');
    if (adminTabBtn) adminTabBtn.style.display = 'none';
    
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
  });

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const targetPanel = button.getAttribute('data-target');
      
      // Block admin tab if not authorized
      if (targetPanel === 'admin' && (!state.currentUser || state.currentUser.employeeId !== '20027854')) {
        alert("คุณไม่มีสิทธิ์เข้าถึงเมนูผู้ดูแลระบบ!");
        return;
      }
      
      tabs.forEach(t => t.classList.remove('active'));
      button.classList.add('active');
      
      const panels = document.querySelectorAll('.tab-panel');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${targetPanel}`).classList.add('active');
      
      if (targetPanel === 'dashboard') {
        fetchMatches();
        fetchLeaderboard();
      } else if (targetPanel === 'predictions') {
        fetchUserPredictions();
      } else if (targetPanel === 'bracket') {
        renderBracket();
      }
    });
  });

  // Leaderboard toggle listeners removed as Team leaderboard was deleted.

  const filterDateEl = document.getElementById('match-filter-date');
  if (filterDateEl) filterDateEl.addEventListener('change', renderPredictionList);
  
  const showPredictedEl = document.getElementById('match-filter-show-predicted');
  if (showPredictedEl) showPredictedEl.addEventListener('change', renderPredictionList);



  document.getElementById('admin-select-match').addEventListener('change', (e) => {
    const matchId = e.target.value;
    const match = state.matches.find(m => m.id === matchId);
    if (match) {
      document.getElementById('admin-home-team-label').innerHTML = `${getFlag(match.home_team_name_en || match.home_team_label)} ${match.home_team_name_en || match.home_team_label || 'TBD'}`;
      document.getElementById('admin-away-team-label').innerHTML = `${getFlag(match.away_team_name_en || match.away_team_label)} ${match.away_team_name_en || match.away_team_label || 'TBD'}`;
      document.getElementById('admin-home-score').value = match.home_score || '0';
      document.getElementById('admin-away-score').value = match.away_score || '0';
      document.getElementById('admin-match-finished').checked = match.finished === "TRUE";
    }
  });

  document.getElementById('admin-simulator-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const matchId = document.getElementById('admin-select-match').value;
      const homeScore = document.getElementById('admin-home-score').value;
      const awayScore = document.getElementById('admin-away-score').value;
      const finished = document.getElementById('admin-match-finished').checked;
      
      if (!matchId) return alert("กรุณาเลือกคู่แข่งขันก่อน!");

      // Write match result directly to Firebase → triggers real-time update for ALL users
      await db_firebase.ref(`matches/${matchId}`).update({
        home_score: String(homeScore),
        away_score: String(awayScore),
        finished: finished ? "TRUE" : "FALSE",
        time_elapsed: finished ? "finished" : "notstarted"
      });

      // Recalculate ALL user points based on updated match
      await firebaseRecalculateAllPoints();

      alert("บันทึกผลการแข่งขันและคำนวณคะแนน Firebase สำเร็จ! ผู้เล่นทุกคนจะเห็นผลอัปเดตทันที");
    } catch (adminErr) {
      console.error("Admin Simulation Error:", adminErr);
      alert("ไม่สามารถจำลองผลได้: " + adminErr.message);
    }
  });

  document.getElementById('admin-sync-btn').addEventListener('click', async () => {
    const logEl = document.getElementById('admin-sync-log');
    logEl.innerText = "กำลังเชื่อมต่อกับ Live API...\n";
    try {
      const res = await fetch(REMOTE_MATCHES_API);
      if (!res.ok) throw new Error("CORS or Network Blocked");
      const data = await res.json();
      if (data && data.games) {
        const matchMap = {};
        data.games.forEach(g => {
          matchMap[g.id] = {
            id: g.id || "",
            home_team_name_en: g.home_team_name_en || "",
            away_team_name_en: g.away_team_name_en || "",
            home_team_label: g.home_team_label || "",
            away_team_label: g.away_team_label || "",
            home_score: (g.home_score === "null" || g.home_score === null || g.home_score === undefined) ? "0" : String(g.home_score),
            away_score: (g.away_score === "null" || g.away_score === null || g.away_score === undefined) ? "0" : String(g.away_score),
            finished: g.finished || "FALSE",
            local_date: g.local_date || "",
            group: g.group || "",
            type: g.type || "",
            time_elapsed: g.time_elapsed || "notstarted"
          };
        });
        // Write all matches to Firebase → all users see live scores instantly
        await db_firebase.ref('matches').update(matchMap);
        // Recalculate all user points
        await firebaseRecalculateAllPoints();
        logEl.innerText += `สำเร็จ! ซิงค์ผลคะแนนจริงได้ ${data.games.length} แมตช์ เขียน Firebase เรียบร้อย! ผู้เล่นทุกคนจะเห็นผลทันที`;
      }
    } catch (err) {
      logEl.innerText += `ล้มเหลวในการดึงข้อมูลสด (ข้ามปัญหา CORS/อินเทอร์เน็ต): ${err.message}\nใช้โครงร่างสายแข่งที่มีอยู่เพื่อจำลองต่อไปได้เลยครับ`;
    }
  });

  document.getElementById('admin-reset-db-btn').addEventListener('click', async () => {
    if (!confirm("ล้างข้อมูลทั้งหมดใน Firebase? (ผู้ใช้ทุกคนจะถูกลบมสิทธิ์)")) return;
    // Reset users and predictions in Firebase, but keep matches
    await db_firebase.ref('users').remove();
    await db_firebase.ref('predictions').remove();
    // Re-seed matches from FALLBACK_MATCHES
    const matchMap = {};
    FALLBACK_MATCHES.forEach(m => { matchMap[m.id] = m; });
    await db_firebase.ref('matches').set(matchMap);
    alert("ล้างข้อมูล Firebase สำเร็จ!");
    window.location.reload();
  });

  document.getElementById('refresh-dashboard-btn').addEventListener('click', async () => {
    const btn = document.getElementById('refresh-dashboard-btn');
    btn.innerHTML = `<i class="fa-solid fa-rotate animate-spin-slow"></i> กำลังรีเฟรช...`;
    btn.disabled = true;
    try {
      await fetchMatches();
      if (state.currentUser) await fetchLeaderboard();
    } catch (refErr) {
      console.warn("Refresh error", refErr);
    }
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-rotate"></i> รีเฟรช`;
      btn.disabled = false;
    }, 600);
  });
});
