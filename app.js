const events = [
  {
    title: "Tanışma Toplantısı",
    date: "2026-01-15",
    time: "18:00",
    place: "Mühendislik Fakültesi - Amfi 2",
    type: "Toplantı",
    desc: "Yeni üyelerle tanışıyoruz, dönem planını konuşuyoruz.",
    link: "#",
    image: "image/100.jpeg"
  },
  {
    title: "React ile Web Atölyesi",
    date: "2026-01-28",
    time: "17:30",
    place: "Lab 3",
    type: "Teknik Gezi",
    desc: "Component mantığı + mini proje.",
    link: "#",
    image: "image/100.jpeg"
  },
  {
    title: "Kariyer Söyleşisi",
    date: "2026-02-05",
    time: "19:00",
    place: "Konferans Salonu",
    type: "Söyleşi",
    desc: "Sektörden konuk ile yol haritası ve Q&A.",
    link: "#",
    image: "image/event-3.jpg"
  }
];

const $ = (s) => document.querySelector(s);


const eventsGrid = $("#eventsGrid");
const pastEventsGrid = $("#pastEventsGrid");
const nextEventBox = $("#nextEvent");
const statEvents = $("#statEvents");


function formatTR(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" });
}

function startOfTodayTs(){
  const today = new Date();
  return new Date(today.toDateString()).getTime(); 
}

function renderEventCards(list, target){
  if (!target) return;

  if (!list.length){
    target.innerHTML = `<p class="muted">Etkinlik bulunamadı.</p>`;
    return;
  }

  const sorted = [...list].sort((a,b) => {
    const ta = new Date(a.date + "T00:00:00").getTime();
    const tb = new Date(b.date + "T00:00:00").getTime();
    return ta - tb;
  });

  target.innerHTML = sorted.map(e => `
    <article class="card event-card">
      ${e.image ? `<img class="event-photo" src="${e.image}" alt="${e.title}">` : ""}
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

function splitEvents(){
  const todayTs = startOfTodayTs();
  const upcoming = [];
  const past = [];

  events.forEach(e => {
    const ts = new Date(e.date + "T00:00:00").getTime();
    if (ts >= todayTs) upcoming.push(e);
    else past.push(e);
  });

  past.sort((a,b) => {
    const ta = new Date(a.date + "T00:00:00").getTime();
    const tb = new Date(b.date + "T00:00:00").getTime();
    return tb - ta;
  });

  return { upcoming, past };
}

function renderNextEvent(upcoming){
  if (!nextEventBox) return;

  if(!upcoming.length){
    nextEventBox.innerHTML = `<p class="muted">Şu an yaklaşan etkinlik yok. Yakında duyuracağız.</p>`;
    return;
  }

  const next = [...upcoming]
    .map(e => ({...e, ts: new Date(e.date + "T00:00:00").getTime()}))
    .sort((a,b) => a.ts - b.ts)[0];

  nextEventBox.innerHTML = `
    <div class="badge">📌 ${next.type}</div>
    <h4 style="margin:0">${next.title}</h4>
    <div class="muted">📅 ${formatTR(next.date)} • ${next.time}</div>
    <div class="muted">📍 ${next.place}</div>
    ${next.link ? `<a class="btn btn-small" href="${next.link}" target="_blank" rel="noreferrer">Kayıt Ol</a>` : ""}
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
  const track = $("#teamTrack");
  const prev = $("#teamPrev");
  const next = $("#teamNext");
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

function formSent(){
  const status = document.getElementById("formStatus");
  if(status){
    status.textContent = "Mesajınız gönderildi ";
    setTimeout(() => status.textContent = "", 4000);
  }
}


function init(){
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (statEvents) statEvents.textContent = String(events.length);

  const { upcoming, past } = splitEvents();

  renderEventCards(upcoming, eventsGrid);
  renderEventCards(past, pastEventsGrid);
  renderNextEvent(upcoming);

  setupMenu();
  setupTeamSlider();
}

init();
