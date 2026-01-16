const events = [
  {
    title: "Tanışma Toplantısı",
    date: "2026-01-22",
    time: "18:00",
    place: "Mühendislik Fakültesi - Amfi 2",
    type: "Toplantı",
    desc: "Yeni üyelerle tanışıyoruz, dönem planını konuşuyoruz.",
    link: "#"
  },
  {
    title: "React ile Web Atölyesi",
    date: "2026-01-28",
    time: "17:30",
    place: "Lab 3",
    type: "Atölye", // <- İstersen "Teknik Gezi" yapabilirsin
    desc: "Component mantığı + mini proje.",
    link: "#"
  },
  {
    title: "Kariyer Söyleşisi",
    date: "2026-02-05",
    time: "19:00",
    place: "Konferans Salonu",
    type: "Söyleşi",
    desc: "Sektörden konuk ile yol haritası ve Q&A.",
    link: "#"
  }
];

const $ = (s) => document.querySelector(s);

const eventsGrid = $("#eventsGrid");
const nextEventBox = $("#nextEvent");
const statEvents = $("#statEvents");

function formatTR(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" });
}

function renderEvents(list){
  if (!eventsGrid) return;

  const sorted = [...list].sort((a, b) => {
    const ta = new Date(a.date + "T00:00:00").getTime();
    const tb = new Date(b.date + "T00:00:00").getTime();
    return ta - tb;
  });

  if (!sorted.length){
    eventsGrid.innerHTML = `<p class="muted">Şu an etkinlik yok.</p>`;
    return;
  }

  eventsGrid.innerHTML = sorted.map(e => `
    <article class="card">
      <span class="badge">${e.type}</span>
      <h3>${e.title}</h3>
      <p>${e.desc}</p>
      <div class="meta">
        <span class="pill">📅 ${formatTR(e.date)} • ${e.time}</span>
        <span class="pill">📍 ${e.place}</span>
        ${e.link ? `<a class="pill" href="${e.link}" target="_blank" rel="noreferrer">Kayıt / Detay</a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderNextEvent(){
  if (!nextEventBox) return;

  const today = new Date();
  const startOfToday = new Date(today.toDateString()).getTime();

  const upcoming = events
    .map(e => ({...e, ts: new Date(e.date + "T00:00:00").getTime()}))
    .filter(e => e.ts >= startOfToday)
    .sort((a,b) => a.ts - b.ts)[0];

  if(!upcoming){
    nextEventBox.innerHTML = `<p class="muted">Şu an yaklaşan etkinlik yok. Yakında duyuracağız.</p>`;
    return;
  }

  nextEventBox.innerHTML = `
    <div class="badge">📌 ${upcoming.type}</div>
    <h4 style="margin:0">${upcoming.title}</h4>
    <div class="muted">📅 ${formatTR(upcoming.date)} • ${upcoming.time}</div>
    <div class="muted">📍 ${upcoming.place}</div>
    ${upcoming.link ? `<a class="btn btn-small" href="${upcoming.link}" target="_blank" rel="noreferrer">Kayıt Ol</a>` : ""}
  `;
}

function setupMenu(){
  const btn = $("#menuBtn");
  const nav = $("#nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function setupTeamSlider(){
  const track = document.querySelector("#teamTrack");
  const prev = document.querySelector("#teamPrev");
  const next = document.querySelector("#teamNext");
  if(!track || !prev || !next) return;

  const scrollAmount = () => {
    const firstCard = track.querySelector(".card");
    return firstCard ? firstCard.getBoundingClientRect().width + 14 : 320;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

function init(){
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (statEvents) statEvents.textContent = String(events.length);

  renderEvents(events);
  renderNextEvent();
  setupMenu();
  setupTeamSlider();
}

init();
