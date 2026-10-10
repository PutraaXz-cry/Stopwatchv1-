let startTime = 0;
let elapsed = 0;
let timer = null;
let running = false;
let laps = [];

const timeEl = document.getElementById("time");
const msEl = document.getElementById("ms");
const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapsEl = document.getElementById("laps");

function format(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");

  return {
    main: h + ":" + m + ":" + s,
    ms: "." + cs
  };
}

function update() {
  const now = Date.now();
  const current = elapsed + (running ? now - startTime : 0);
  const f = format(current);
  timeEl.textContent = f.main;
  msEl.textContent = f.ms;
}

function start() {
  if (!running) {
    startTime = Date.now();
    timer = setInterval(update, 10);
    running = true;
    startBtn.textContent = "Pause";
    startBtn.classList.add("running");
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    elapsed += Date.now() - startTime;
    clearInterval(timer);
    running = false;
    startBtn.textContent = "Start";
    startBtn.classList.remove("running");
    lapBtn.disabled = true;
  }
}

function lap() {
  if (!running) return;

  const now = Date.now();
  const total = elapsed + (now - startTime);
  const lastTotal = laps.length > 0 ? laps[laps.length - 1].total : 0;

  laps.push({
    num: laps.length + 1,
    lap: total - lastTotal,
    total: total
  });

  Database.saveLaps(laps);
  renderLaps();
}

function reset() {
  clearInterval(timer);
  startTime = 0;
  elapsed = 0;
  running = false;
  laps = [];

  Database.clear();

  timeEl.textContent = "00:00:00";
  msEl.textContent = ".00";
  startBtn.textContent = "Start";
  startBtn.classList.remove("running");
  lapBtn.disabled = true;
  resetBtn.disabled = true;

  renderLaps();
}

function renderLaps() {
  if (laps.length === 0) {
    lapsEl.innerHTML = "<div class=\"empty\">Belum ada lap</div>";
    return;
  }

  let html = "";
  html += "<div class=\"lap-header\">";
  html += "<div>#</div>";
  html += "<div>LAP</div>";
  html += "<div>TOTAL</div>";
  html += "</div>";

  for (let i = laps.length - 1; i >= 0; i--) {
    const l = laps[i];
    const lf = format(l.lap);
    const tf = format(l.total);

    html += "<div class=\"lap-row\">";
    html += "<div class=\"num\">" + l.num + "</div>";
    html += "<div>" + lf.main + lf.ms + "</div>";
    html += "<div>" + tf.main + tf.ms + "</div>";
    html += "</div>";
  }

  lapsEl.innerHTML = html;
}

startBtn.onclick = start;
lapBtn.onclick = lap;
resetBtn.onclick = reset;

document.onkeydown = function (e) {
  if (e.code === "Space") {
    e.preventDefault();
    start();
  }
  if (e.code === "KeyL" && running) {
    lap();
  }
  if (e.code === "KeyR") {
    reset();
  }
};

laps = Database.getLaps();
renderLaps();