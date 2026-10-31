/* Meo Phonics — interactive phonics for kids & parents */
(() => {
  "use strict";

  // ================= State =================
  const STORE_KEY = "meoPhonics.v1";
  const defaults = {
    stars: 0, learned: {}, practiced: {}, streak: 0, lastDay: null,
    name: "", voiceURI: "", rate: 0.8, sfx: true, games: {},
  };
  let state = load();

  function load() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; }
    catch { return { ...defaults }; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
    renderStats();
  }

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const groupOf = (id) => GROUPS.find((g) => g.id === id);
  const soundOf = (g) => SOUNDS.find((s) => s.g === g);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function touchStreak() {
    const today = new Date().toDateString();
    if (state.lastDay === today) return;
    const y = new Date(Date.now() - 864e5).toDateString();
    state.streak = state.lastDay === y ? state.streak + 1 : 1;
    state.lastDay = today;
    save();
  }

  function addStars(n, msg) {
    const before = unlockedCount();
    state.stars += n;
    touchStreak();
    save();
    if (msg) toast(msg);
    if (unlockedCount() > before) {
      const st = STICKERS[unlockedCount() - 1];
      setTimeout(() => { toast(`🎉 ได้สติกเกอร์ใหม่! ${st.e} ${st.name}`); confetti(); sfx("win"); }, 900);
    }
  }
  const unlockedCount = () => STICKERS.filter((s) => state.stars >= s.cost).length;

  // ================= Audio: speech & sfx =================
  let voices = [];
  function loadVoices() {
    voices = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const sel = $("#voiceSelect");
    if (!sel) return;
    sel.innerHTML = voices.length
      ? voices.map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("")
      : `<option value="">(ไม่พบเสียงภาษาอังกฤษ — ใช้ค่าเริ่มต้น)</option>`;
    if (!state.voiceURI && voices.length) {
      const pref = voices.find((v) => /en-GB/i.test(v.lang) && /female|google|samantha|serena|libby|sonia/i.test(v.name))
        || voices.find((v) => /en-GB/i.test(v.lang)) || voices.find((v) => /en-US/i.test(v.lang)) || voices[0];
      state.voiceURI = pref.voiceURI;
    }
    sel.value = state.voiceURI;
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text, { rate, onend } = {}) {
    if (!("speechSynthesis" in window)) { toast("เบราว์เซอร์นี้ไม่รองรับเสียงอ่าน"); return; }
    speechSynthesis.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.voiceURI === state.voiceURI);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-GB";
    u.rate = rate ?? state.rate;
    u.pitch = 1.1;
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  }
  // ================= Real human voice =================
  // Priority: parent's own recording (IndexedDB) > bundled recording (AUDIO_FILES) > browser TTS
  const BUNDLED = typeof AUDIO_FILES !== "undefined" ? AUDIO_FILES : {};
  const parentClips = {}; // key -> object URL
  let idb = null, currentAudio = null;

  function openVoiceDB() {
    return new Promise((res) => {
      try {
        const r = indexedDB.open("meoPhonicsVoice", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("clips");
        r.onsuccess = () => res(r.result);
        r.onerror = () => res(null);
      } catch { res(null); }
    });
  }
  openVoiceDB().then((db) => {
    idb = db;
    if (!db) return;
    const req = db.transaction("clips").objectStore("clips").openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (c) { parentClips[c.key] = URL.createObjectURL(c.value); c.continue(); }
    };
  });
  function saveParentClip(key, blob) {
    if (parentClips[key]) URL.revokeObjectURL(parentClips[key]);
    parentClips[key] = URL.createObjectURL(blob);
    try { idb && idb.transaction("clips", "readwrite").objectStore("clips").put(blob, key); } catch { /* memory only */ }
  }
  function deleteParentClip(key) {
    if (parentClips[key]) URL.revokeObjectURL(parentClips[key]);
    delete parentClips[key];
    try { idb && idb.transaction("clips", "readwrite").objectStore("clips").delete(key); } catch { /* ignore */ }
  }
  const clipURL = (key) => parentClips[key] || BUNDLED[key] || null;
  const clipSource = (key) => (parentClips[key] ? "parent" : BUNDLED[key] ? "real" : "tts");
  const SOURCE_LABEL = { parent: "👩 เสียงพ่อแม่", real: "🧑‍🏫 เสียงคนจริง", tts: "🤖 เสียงสังเคราะห์" };

  function stopAll() {
    window.speechSynthesis?.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  }
  function playURL(url, { slow = false, onend } = {}) {
    stopAll();
    const a = new Audio(url);
    a.playbackRate = slow ? 0.7 : 1;
    a.preservesPitch = true;
    currentAudio = a;
    a.onended = () => { if (currentAudio === a) { currentAudio = null; onend && onend(); } };
    a.play().catch(() => { if (currentAudio === a) currentAudio = null; });
  }
  // Play a word: real recording if available, else TTS
  function playWord(word, { rate, onend } = {}) {
    const url = clipURL("word:" + word);
    if (url) playURL(url, { slow: rate !== undefined && rate < 0.75, onend });
    else speak(word, { rate, onend });
  }
  // Play a sound: the real phoneme clip then the key word; else TTS approximation
  function speakSound(s, { slow = false } = {}) {
    const w = s.words[0][0];
    const url = clipURL("sound:" + s.g);
    if (url) { playURL(url, { slow, onend: () => setTimeout(() => playWord(w, { rate: slow ? 0.5 : undefined }), 350) }); return; }
    const rate = slow ? 0.5 : state.rate * 0.85;
    if (clipURL("word:" + w)) {
      // no clean recording of the lone sound: play the real recording of the key word twice
      playWord(w, { rate, onend: () => setTimeout(() => playWord(w, { rate }), 450) });
      return;
    }
    if (s.stretch) speak(`${s.stretch}... ${w}`, { rate });
    else speak(`${w}. ${w}`, { rate });
  }
  // Segment a word: real phoneme clips one by one, then the whole word.
  // Without real clips we stretch the word slowly (TTS reads lone letters as letter NAMES).
  function speakSegmented(parts, word, onPart) {
    const urls = parts.map((p) => clipURL("sound:" + p));
    if (urls.every(Boolean)) {
      const step = (i) => {
        if (i >= urls.length) { setTimeout(() => playWord(word), 400); return; }
        onPart && onPart(i);
        playURL(urls[i], { onend: () => setTimeout(() => step(i + 1), 250) });
      };
      step(0);
      return;
    }
    playWord(word, { rate: 0.4, onend: () => setTimeout(() => playWord(word), 250) });
  }

  let actx;
  function sfx(type) {
    if (!state.sfx) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [660, 880], bad: [220, 180], win: [523, 659, 784, 1047], tap: [520] }[type] || [440];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type === "bad" ? "sawtooth" : "triangle";
        o.frequency.value = f;
        const t = actx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g).connect(actx.destination);
        o.start(t); o.stop(t + 0.25);
      });
    } catch { /* ignore */ }
  }

  // ================= Speech recognition =================
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  // set when the browser/frame refuses the microphone: fall back to parent judging
  let srBlocked = false;
  const canListen = () => SR && !srBlocked;
  const isBlocked = (e) => e === "not-allowed" || e === "service-not-allowed" || e === "audio-capture";
  function listen({ onResult, onEnd, onError }) {
    if (!SR) { onError && onError("unsupported"); return null; }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.onresult = (e) => {
      const alts = [...e.results[0]].map((a) => a.transcript.toLowerCase().trim());
      onResult(alts);
    };
    r.onerror = (e) => onError && onError(e.error);
    r.onend = () => onEnd && onEnd();
    try { r.start(); } catch (e) { onError && onError(e.message); }
    return r;
  }
  const normalize = (t) => t.toLowerCase().replace(/[^a-z\s-]/g, "").trim();
  const homophones = { sue: ["sue", "soo", "su"], high: ["hi", "high"], bee: ["b", "be", "bee"], tree: ["tree", "three"] };
  function matches(alts, target) {
    target = normalize(target);
    const ok = new Set([target, ...(homophones[target] || [])]);
    return alts.some((a) => normalize(a).split(/\s+/).some((w) => ok.has(w)) || normalize(a) === target);
  }

  // ================= Recorder =================
  let mediaRec = null;
  // Records up to maxMs; clicking the same button again stops early. Resolves with a Blob (or null).
  function recordClip(btn, maxMs = 4000) {
    if (mediaRec && mediaRec.state === "recording") { mediaRec.stop(); return Promise.resolve(null); }
    return new Promise(async (resolve) => {
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch { toast("เปิดไมโครโฟนไม่ได้ — ต้องเปิดเว็บผ่าน https/localhost และกดอนุญาตไมค์"); resolve(null); return; }
      stopAll();
      const chunks = [];
      const rec = new MediaRecorder(stream);
      const label = btn.innerHTML;
      mediaRec = rec;
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        btn.classList.remove("recording");
        btn.innerHTML = label;
        mediaRec = null;
        resolve(chunks.length ? new Blob(chunks, { type: rec.mimeType || "audio/webm" }) : null);
      };
      rec.start();
      btn.classList.add("recording");
      btn.textContent = "⏹️ หยุดอัด";
      setTimeout(() => rec.state === "recording" && rec.stop(), maxMs);
    });
  }

  // ================= Camera mirror =================
  let camStream = null;
  async function startMirror(wrap, s) {
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      wrap.innerHTML = `<video autoplay playsinline muted></video>
        <div class="mirror-overlay"><span class="big">${s.action.emoji}</span> ทำท่า <b>${esc(s.action.name)}</b> + พูด <b class="en">${esc(s.g)}</b></div>`;
      wrap.classList.remove("hidden");
      $("video", wrap).srcObject = camStream;
    } catch {
      toast("เปิดกล้องไม่ได้ — กรุณาอนุญาตการใช้กล้อง");
    }
  }
  function stopMirror() {
    if (camStream) { camStream.getTracks().forEach((t) => t.stop()); camStream = null; }
  }

  // ================= Navigation =================
  function go(view) {
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.go === view));
    if (view === "games") showGameMenu();
    if (view === "stickers") renderStickers();
    if (view === "home") renderJourney();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) { go(g.dataset.go); return; }
    const c = e.target.closest("[data-close]");
    if (c) closeModal(c.closest(".modal"));
  });
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModal(m); }));
  function openModal(m) { m.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
  function closeModal(m) {
    m.classList.add("hidden"); document.body.style.overflow = "";
    stopMirror(); stopAll(); if (mediaRec && mediaRec.state === "recording") mediaRec.stop();
    renderSoundGroups(); renderJourney();
  }

  // ================= Render: header / home =================
  function renderStats() {
    $("#starCount").textContent = state.stars;
    $("#streakCount").textContent = state.streak;
  }

  function renderJourney() {
    $("#journey").innerHTML = GROUPS.map((g) => {
      const list = SOUNDS.filter((s) => s.group === g.id);
      const done = list.filter((s) => state.learned[s.g]).length;
      const pct = Math.round((done / list.length) * 100);
      return `<div class="stage" style="--c:${g.color}" data-stage="${g.id}">
        <div class="stage-badge">${pct === 100 ? "🏆" : g.id}</div>
        <div class="stage-info"><b>${g.name}</b> <small>${esc(g.desc)}</small>
          <div class="bar"><i style="width:${pct}%"></i></div></div>
        <div>${done}/${list.length}</div></div>`;
    }).join("");
    $$(".stage").forEach((el) => el.onclick = () => {
      go("sounds");
      setTimeout(() => $(`#group-${el.dataset.stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    });
    const name = state.name ? state.name : "";
    $(".hero h1").innerHTML = name
      ? `สวัสดี <span class="hl">${esc(name)}</span>! เหมียวรออยู่เลย`
      : `สวัสดี! ฉันชื่อ <span class="hl">เหมียว</span>`;
  }

  $("#heroMascot").onclick = () => {
    const lines = ["Meow! Let's learn phonics!", "Good job! You are a star!", "Say it with me: s s s, snake!"];
    speak(pick(lines), { rate: 0.9 });
    $("#heroMascot").textContent = pick(["🐱", "😺", "😸", "😻"]);
  };
  $("#todayBtn").onclick = () => {
    const idx = Math.floor(Date.now() / 864e5) % SOUNDS.length;
    openSound(SOUNDS[idx].g);
  };

  // ================= Render: sound cards =================
  function renderSoundGroups() {
    $("#soundGroups").innerHTML = GROUPS.map((g) => `
      <div class="group-block" id="group-${g.id}" style="--c:${g.color}">
        <div class="group-head"><span class="dot"></span><h3 style="margin:0">${g.name}</h3><small>${esc(g.desc)}</small></div>
        <div class="card-grid">
          ${SOUNDS.filter((s) => s.group === g.id).map((s) => `
            <button class="sound-card" data-sound="${esc(s.g)}">
              ${state.learned[s.g] ? '<span class="done-badge">✅</span>' : ""}
              <span class="grapheme">${esc(s.g)}</span>
              <span class="act">${s.action.emoji}</span>
              <span class="nm">${esc(s.action.name)}</span>
            </button>`).join("")}
        </div>
      </div>`).join("");
    $$(".sound-card").forEach((b) => b.onclick = () => openSound(b.dataset.sound));
  }

  function highlightWord(word, g) {
    const i = word.indexOf(g);
    if (i < 0) return esc(word);
    return esc(word.slice(0, i)) + "<b>" + esc(g) + "</b>" + esc(word.slice(i + g.length));
  }

  // Parent voice recorder rows: the sound itself + each example word
  function renderVoiceList(s) {
    const list = $("#voiceList");
    if (!list) return;
    const items = [["sound:" + s.g, `เสียง /${s.g}/`], ...s.words.map(([w, e]) => ["word:" + w, `${e} ${w}`])];
    list.innerHTML = items.map(([key, label]) => `
      <div class="voice-row">
        <span class="en vr-label">${esc(label)}</span>
        <span class="vr-src">${SOURCE_LABEL[clipSource(key)]}</span>
        <button class="btn rec small" data-vrec="${esc(key)}">🎙️ อัด</button>
        ${parentClips[key] ? `<button class="btn small" data-vplay="${esc(key)}">▶️</button>
          <button class="btn small" data-vdel="${esc(key)}">🗑️</button>` : ""}
      </div>`).join("");
    $$("[data-vrec]", list).forEach((b) => b.onclick = async () => {
      const blob = await recordClip(b, 3000);
      if (!blob) return;
      saveParentClip(b.dataset.vrec, blob);
      toast("บันทึกเสียงต้นแบบแล้ว 👩 ลองกด 🔊 ฟังได้เลย");
      renderVoiceList(s);
    });
    $$("[data-vplay]", list).forEach((b) => b.onclick = () => playURL(parentClips[b.dataset.vplay]));
    $$("[data-vdel]", list).forEach((b) => b.onclick = () => { deleteParentClip(b.dataset.vdel); renderVoiceList(s); });
    const badge = $("#srcBadge");
    if (badge) {
      const src = clipSource("sound:" + s.g);
      badge.textContent = "เสียงที่ใช้: " + (src === "tts" && clipSource("word:" + s.words[0][0]) !== "tts"
        ? SOURCE_LABEL.real + " (จากคำ " + s.words[0][0] + ")"
        : SOURCE_LABEL[src]);
    }
  }

  function openSound(g) {
    const s = soundOf(g);
    const grp = groupOf(s.group);
    const idx = SOUNDS.indexOf(s);
    const prev = SOUNDS[idx - 1], next = SOUNDS[idx + 1];
    const box = $("#soundDetail");
    box.style.setProperty("--c", grp.color);
    box.innerHTML = `
      <div class="sd-top">
        <div class="sd-letter grapheme" id="sdLetter" title="แตะเพื่อฟัง">${esc(s.g)}</div>
        <div class="sd-meta">
          <div class="ipa">${grp.name} · เสียง ${esc(s.ipa)}</div>
          <div class="th-sound">ใกล้เคียง: ${esc(s.th)}</div>
          <div class="rec-row">
            <button class="btn primary" id="sdPlay">🔊 ฟังเสียง</button>
            <button class="btn" id="sdSlow">🐢 ช้าๆ</button>
          </div>
          <div class="src-badge" id="srcBadge"></div>
        </div>
      </div>

      <div class="sd-section">
        <h4>👄 วางปากและลิ้นอย่างไร</h4>
        <p>${esc(s.mouth)}</p>
      </div>
      <div class="sd-section trap">
        <h4>⚠️ ระวังให้ดี!</h4>
        <p>${esc(s.trap)}</p>
      </div>

      <div class="sd-section action">
        <h4>🙌 ท่ามือ: ${esc(s.action.name)}</h4>
        <div class="action-row">
          <span class="action-emoji">${s.action.emoji}</span>
          <p style="flex:1">${esc(s.action.how)}</p>
        </div>
        <div class="rec-row" style="margin-top:8px">
          <button class="btn" id="sdMirror">🪞 เปิดกระจกวิเศษ (กล้อง)</button>
          <button class="btn ok" id="sdActionDone">✋ ทำท่าได้แล้ว! (+1⭐)</button>
        </div>
        <div class="mirror-wrap hidden" id="mirrorWrap"></div>
      </div>

      <div class="sd-section">
        <h4>📚 คำตัวอย่าง (แตะเพื่อฟัง)</h4>
        <div class="words-row">
          ${s.words.map(([w, e]) => `<button class="word-chip" data-word="${esc(w)}">${e} <span class="en">${highlightWord(w, s.g)}</span></button>`).join("")}
        </div>
      </div>

      <div class="sd-section">
        <h4>🎤 ฝึกพูด</h4>
        <p>อัดเสียงตัวเองพูดคำว่า <b class="en">${esc(s.words[0][0])}</b> แล้วฟังเทียบกับเสียงต้นแบบ หรือให้ไมค์ช่วยตรวจ</p>
        <div class="rec-row">
          <button class="btn rec" id="sdRec">🎙️ อัดเสียง</button>
          <button class="btn" id="sdPlayRec" disabled>▶️ ฟังเสียงฉัน</button>
          <button class="btn" id="sdCompare" disabled>🔁 เทียบ: ต้นแบบ → ฉัน</button>
          <button class="btn" id="sdCheck">✅ ให้ไมค์ตรวจ</button>
        </div>
        <div class="result-msg" id="sdResult"></div>
      </div>

      <div class="sd-section voice">
        <h4>🗣️ เสียงต้นแบบจากพ่อแม่</h4>
        <p><small>พ่อแม่อัดเสียงตัวเองเป็นต้นแบบได้ แอปจะเล่นเสียงนี้แทนเสียงสังเคราะห์ทุกที่ (ทั้งการ์ดและเกม) เสียงเก็บไว้ในเครื่องนี้เท่านั้น
        — อัดเสียงเดี่ยวให้สั้นและไม่เติมสระ เช่น /${esc(s.g)}/ ไม่ใช่ชื่อตัวอักษร</small></p>
        <div class="voice-list" id="voiceList"></div>
      </div>

      <div class="done-row">
        <div class="nav-arrows">
          <button class="btn" id="sdPrev" ${prev ? "" : "disabled"}>⬅️ ${prev ? esc(prev.g) : ""}</button>
          <button class="btn" id="sdNext" ${next ? "" : "disabled"}>${next ? esc(next.g) : ""} ➡️</button>
        </div>
        <button class="btn ${state.learned[s.g] ? "" : "primary"} big" id="sdLearned">
          ${state.learned[s.g] ? "✅ เรียนแล้ว" : "⭐ เรียนเสียงนี้แล้ว! (+3⭐)"}
        </button>
      </div>`;

    openModal($("#soundModal"));
    $(".modal-box", $("#soundModal")).scrollTop = 0;
    $("#soundModal").scrollTop = 0;

    $("#sdPlay").onclick = $("#sdLetter").onclick = () => speakSound(s);
    $("#sdSlow").onclick = () => speakSound(s, { slow: true });
    $$(".word-chip", box).forEach((b) => b.onclick = () => playWord(b.dataset.word));
    renderVoiceList(s);
    $("#sdMirror").onclick = () => {
      const w = $("#mirrorWrap");
      if (camStream) { stopMirror(); w.classList.add("hidden"); $("#sdMirror").textContent = "🪞 เปิดกระจกวิเศษ (กล้อง)"; }
      else startMirror(w, s).then(() => { if (camStream) $("#sdMirror").textContent = "🙈 ปิดกล้อง"; });
    };
    $("#sdActionDone").onclick = (e) => {
      if (state.practiced[s.g + ":action"]) { toast("เก่งมาก! ทำท่าอีกรอบได้นะ 💪"); return; }
      state.practiced[s.g + ":action"] = true;
      addStars(1, `เยี่ยม! ท่า ${s.action.emoji} ${s.action.name} +1⭐`);
      sfx("ok"); e.target.textContent = "✋ ทำท่าได้แล้ว ✔";
    };
    let kidURL = null;
    $("#sdRec").onclick = async () => {
      const blob = await recordClip($("#sdRec"), 5000);
      if (!blob) return;
      if (kidURL) URL.revokeObjectURL(kidURL);
      kidURL = URL.createObjectURL(blob);
      $("#sdPlayRec").disabled = $("#sdCompare").disabled = false;
      toast("อัดเสร็จแล้ว! กด 🔁 เทียบ เพื่อฟังต้นแบบแล้วตามด้วยเสียงตัวเอง");
    };
    $("#sdPlayRec").onclick = () => kidURL && playURL(kidURL);
    $("#sdCompare").onclick = () => kidURL && playWord(s.words[0][0], { onend: () => setTimeout(() => playURL(kidURL), 500) });
    $("#sdCheck").onclick = () => checkSpeech(s.words[0][0], $("#sdResult"), $("#sdCheck"), () => {
      if (!state.practiced[s.g + ":say"]) { state.practiced[s.g + ":say"] = true; addStars(2, "ออกเสียงถูก! +2⭐"); }
    });
    $("#sdPrev").onclick = () => prev && (stopMirror(), openSound(prev.g));
    $("#sdNext").onclick = () => next && (stopMirror(), openSound(next.g));
    $("#sdLearned").onclick = () => {
      if (state.learned[s.g]) return;
      state.learned[s.g] = true;
      addStars(3, `เรียนเสียง "${s.g}" แล้ว! +3⭐`);
      sfx("win"); confetti();
      $("#sdLearned").textContent = "✅ เรียนแล้ว";
      $("#sdLearned").classList.remove("primary");
    };
    setTimeout(() => speakSound(s), 250);
  }

  function checkSpeech(target, outEl, btn, onGood) {
    if (!canListen()) {
      outEl.className = "result-msg";
      outEl.innerHTML = `เบราว์เซอร์นี้ตรวจเสียงไม่ได้ 😿 ให้พ่อแม่ฟังแล้วตัดสิน:
        <button class="btn ok" data-judge="1">👍 ถูก</button> <button class="btn" data-judge="0">🔁 ลองใหม่</button>`;
      $$("[data-judge]", outEl).forEach((b) => b.onclick = () => {
        if (b.dataset.judge === "1") { outEl.className = "result-msg good"; outEl.textContent = "เยี่ยมมาก! 🎉"; sfx("ok"); onGood && onGood(); }
        else { outEl.className = "result-msg try"; outEl.textContent = "ไม่เป็นไร ฟังอีกรอบแล้วลองใหม่นะ 💪"; }
      });
      return;
    }
    const orig = btn.textContent;
    btn.textContent = "👂 กำลังฟัง... พูดเลย!";
    btn.disabled = true;
    outEl.className = "result-msg";
    outEl.textContent = `พูดว่า "${target}"`;
    listen({
      onResult: (alts) => {
        if (matches(alts, target)) {
          outEl.className = "result-msg good";
          outEl.textContent = `🎉 ถูกต้อง! ได้ยินว่า "${alts[0]}"`;
          sfx("ok"); onGood && onGood();
        } else {
          outEl.className = "result-msg try";
          outEl.textContent = `🤔 ได้ยินเป็น "${alts[0]}" — ฟังต้นแบบแล้วลองใหม่นะ`;
          sfx("bad");
        }
      },
      onError: (err) => {
        if (isBlocked(err)) { srBlocked = true; checkSpeech(target, outEl, btn, onGood); return; }
        outEl.className = "result-msg try";
        outEl.textContent = err === "not-allowed" ? "กรุณาอนุญาตไมโครโฟนก่อนนะ" : err === "no-speech" ? "ไม่ได้ยินเสียงเลย พูดดังๆ อีกครั้งนะ" : "ฟังไม่ชัด ลองอีกครั้งนะ";
      },
      onEnd: () => { btn.textContent = orig; btn.disabled = false; },
    });
  }

  // ================= Games =================
  const area = () => $("#gameArea");
  function showGameMenu() { $("#gameMenu").classList.remove("hidden"); area().classList.add("hidden"); area().innerHTML = ""; }
  $$(".game-card").forEach((c) => c.onclick = () => startGame(c.dataset.game));

  function startGame(name) {
    $("#gameMenu").classList.add("hidden");
    area().classList.remove("hidden");
    ({ detective, blend, tricky, action, say, family })[name]();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Pool: learned sounds first, else the first groups
  function soundPool(min = 6) {
    const learned = SOUNDS.filter((s) => state.learned[s.g]);
    if (learned.length >= min) return learned;
    return SOUNDS.slice(0, Math.max(min, 12));
  }
  function maxLevel() {
    const lv = SOUNDS.filter((s) => state.learned[s.g]).reduce((m, s) => Math.max(m, s.group), 0);
    return Math.max(lv, 2);
  }

  // Generic quiz runner
  function runQuiz({ title, rounds = 8, makeRound, renderRound, gameKey }) {
    let i = 0, score = 0;
    const qs = Array.from({ length: rounds }, (_, k) => makeRound(k));
    const next = () => {
      if (i >= rounds) return finish();
      const q = qs[i];
      area().innerHTML = `
        <div class="game-head">
          <button class="btn" id="gBack">⬅️ กลับ</button>
          <h2>${title}</h2>
          <div class="game-progress"><div class="bar"><i style="width:${(i / rounds) * 100}%;background:var(--primary)"></i></div>
          <small>ข้อ ${i + 1}/${rounds} · ถูก ${score}</small></div>
        </div>
        <div class="game-stage" id="gStage"></div>`;
      $("#gBack").onclick = showGameMenu;
      let answered = false;
      renderRound(q, $("#gStage"), (correct) => {
        if (answered) return;
        answered = true;
        if (correct) score++;
        i++;
        setTimeout(next, correct ? 900 : 1600);
      });
    };
    const finish = () => {
      const stars = Math.round((score / rounds) * 5);
      state.games[gameKey] = Math.max(state.games[gameKey] || 0, score);
      addStars(stars);
      if (score >= rounds * 0.7) { confetti(); sfx("win"); }
      area().innerHTML = `
        <div class="game-stage end-screen">
          <div class="trophy">${score === rounds ? "🏆" : score >= rounds * 0.7 ? "🥳" : "💪"}</div>
          <h2>${score === rounds ? "สุดยอด! ถูกหมดเลย!" : score >= rounds * 0.7 ? "เก่งมาก!" : "พยายามดีมาก! ลองอีกรอบนะ"}</h2>
          <p>ถูก ${score} จาก ${rounds} ข้อ</p>
          <div class="stars-earned">${"⭐".repeat(stars)}${"☆".repeat(5 - stars)}</div>
          <p>ได้ ${stars} ดาว</p>
          <div class="row-btns" style="justify-content:center">
            <button class="btn primary big" id="gAgain">🔁 เล่นอีก</button>
            <button class="btn big" id="gMenu">🎮 เกมอื่น</button>
          </div>
        </div>`;
      $("#gAgain").onclick = () => startGame(gameKey);
      $("#gMenu").onclick = showGameMenu;
    };
    next();
  }

  function choiceButtons(stage, options, correctVal, renderOpt, done, onAnswer) {
    const wrap = document.createElement("div");
    wrap.className = "choices";
    wrap.innerHTML = options.map((o, k) => `<button class="choice" data-k="${k}">${renderOpt(o)}</button>`).join("");
    stage.appendChild(wrap);
    $$(".choice", wrap).forEach((b) => b.onclick = () => {
      const o = options[+b.dataset.k];
      const ok = o === correctVal;
      $$(".choice", wrap).forEach((x) => (x.disabled = true));
      b.classList.add(ok ? "correct" : "wrong");
      if (!ok) $$(".choice", wrap)[options.indexOf(correctVal)].classList.add("correct");
      sfx(ok ? "ok" : "bad");
      onAnswer && onAnswer(ok, o);
      done(ok);
    });
  }

  // 1) Sound detective: hear a word, choose its first sound
  function detective() {
    const pool = soundPool();
    runQuiz({
      title: "🕵️ นักสืบเสียง", gameKey: "detective",
      makeRound: () => {
        const starts = (s) => s.words.filter(([w]) => w.startsWith(s.g));
        let elig = pool.filter((s) => starts(s).length);
        if (elig.length < 4) elig = SOUNDS.filter((s) => s.group <= 2 && starts(s).length);
        const s = pick(elig);
        const [word, emoji] = pick(starts(s));
        // distractors must not be another valid spelling of the first sound (c/k) or a prefix of the word
        const ok = (x) => x.ipa !== s.ipa && !word.startsWith(x.g);
        let distract = shuffle(pool.filter(ok)).slice(0, 3);
        if (distract.length < 3) distract = shuffle(SOUNDS.filter(ok)).slice(0, 3);
        return { word, emoji, answer: s, options: shuffle([s, ...distract]) };
      },
      renderRound: (q, stage, done) => {
        stage.innerHTML = `
          <div class="prompt-emoji">${q.emoji}</div>
          <p class="prompt-text">ฟังคำนี้ แล้วเลือก <b>เสียงแรก</b> ของคำ</p>
          <button class="btn primary big" id="hear">🔊 ฟังอีกครั้ง</button>`;
        $("#hear").onclick = () => playWord(q.word);
        setTimeout(() => playWord(q.word), 300);
        choiceButtons(stage, q.options, q.answer, (o) => `<span class="en">${esc(o.g)}</span>`, done, () => {
          stage.insertAdjacentHTML("beforeend", `<p class="prompt-text en">${q.emoji} <b>${highlightWord(q.word, q.answer.g)}</b></p>`);
          playWord(q.word);
        });
      },
    });
  }

  // 2) Blend: tap each sound then pick the picture
  function blend() {
    const lv = maxLevel();
    const pool = BLEND_WORDS.filter((w) => w.level <= lv);
    const picks = shuffle(pool).slice(0, 8);
    runQuiz({
      title: "🧪 ผสมเสียงเป็นคำ", gameKey: "blend", rounds: picks.length,
      makeRound: (k) => {
        const w = picks[k];
        const others = shuffle(BLEND_WORDS.filter((x) => x.word !== w.word)).slice(0, 3);
        return { w, options: shuffle([w, ...others]) };
      },
      renderRound: (q, stage, done) => {
        stage.innerHTML = `
          <p class="prompt-text">แตะทีละเสียง 👆 แล้วพูดเร็วๆ ให้ติดกัน... เป็นคำว่าอะไรนะ?</p>
          <div class="tiles">${q.w.parts.map((p, k) => `<button class="letter-tile" data-k="${k}">${esc(p)}</button>`).join("")}</div>
          <div class="row-btns" style="justify-content:center">
            <button class="btn" id="blendSlow">🐢 ฟังช้าๆ (คำใบ้)</button>
          </div>
          <p class="blend-slider">เลือกรูปที่ถูกต้อง 👇</p>`;
        $$(".letter-tile", stage).forEach((t) => t.onclick = () => {
          t.classList.add("lit"); sfx("tap");
          const s = soundOf(t.textContent);
          if (s) { if (clipURL("sound:" + s.g)) playURL(clipURL("sound:" + s.g)); else if (s.stretch) speak(s.stretch, { rate: 0.7 }); else playWord(s.words[0][0], { rate: 0.7 }); toast(`${s.action.emoji} ${s.g} — เสียงเดียวกับใน "${s.words[0][0]}" (${s.th})`); }
          setTimeout(() => t.classList.remove("lit"), 700);
        });
        $("#blendSlow").onclick = () => {
          const tiles = $$(".letter-tile", stage);
          const lite = (k) => { tiles[k].classList.add("lit"); setTimeout(() => tiles[k].classList.remove("lit"), 500); };
          if (q.w.parts.every((p) => clipURL("sound:" + p))) speakSegmented(q.w.parts, q.w.word, lite);
          else { tiles.forEach((t, k) => setTimeout(() => lite(k), k * 600)); speakSegmented(q.w.parts, q.w.word); }
        };
        choiceButtons(stage, q.options, q.w, (o) => `${o.emoji}`, done, () => {
          stage.insertAdjacentHTML("beforeend", `<div class="big-word">${q.w.parts.join("-")} → ${esc(q.w.word)} ${q.w.emoji}</div>`);
          speakSegmented(q.w.parts, q.w.word);
        });
      },
    });
  }

  // 3) Tricky twins (minimal pairs)
  function tricky() {
    area().innerHTML = `
      <div class="game-head"><button class="btn" id="gBack">⬅️ กลับ</button><h2>👯 คู่แฝดหลอกหู</h2><span></span></div>
      <div class="game-stage">
        <p class="prompt-text">เลือกคู่เสียงที่อยากฝึก (หรือเล่นรวมทุกคู่)</p>
        <div class="choices" id="topicList">
          <button class="choice" data-t="all" style="font-size:1.3rem">🎲 <small>รวมทุกคู่</small></button>
          ${TRICKY_PAIRS.map((t, k) => `<button class="choice" data-t="${k}" style="font-size:1.3rem"><span class="en">${esc(t.topic)}</span><small>${esc(t.tip)}</small></button>`).join("")}
        </div>
      </div>`;
    $("#gBack").onclick = showGameMenu;
    $$("#topicList .choice").forEach((b) => b.onclick = () => {
      const sets = b.dataset.t === "all" ? TRICKY_PAIRS : [TRICKY_PAIRS[+b.dataset.t]];
      const all = sets.flatMap((t) => t.pairs.map((p) => ({ p, tip: t.tip, topic: t.topic })));
      runQuiz({
        title: "👯 คู่แฝดหลอกหู", gameKey: "tricky", rounds: 8,
        makeRound: () => {
          const { p, tip, topic } = pick(all);
          const a = { w: p[0], e: p[1] }, b2 = { w: p[2], e: p[3] };
          const target = Math.random() < 0.5 ? a : b2;
          return { target, options: shuffle([a, b2]), tip, topic };
        },
        renderRound: (q, stage, done) => {
          stage.innerHTML = `
            <p class="prompt-text">คู่ <b class="en">${esc(q.topic)}</b> — ฟังให้ดี! ได้ยินคำไหน?</p>
            <button class="btn primary big" id="hear">🔊 ฟังอีกครั้ง</button>
            <p><small>💡 ${esc(q.tip)}</small></p>`;
          $("#hear").onclick = () => playWord(q.target.w, { rate: state.rate * 0.85 });
          setTimeout(() => playWord(q.target.w, { rate: state.rate * 0.85 }), 300);
          choiceButtons(stage, q.options, q.target, (o) => `${o.e}<span class="en" style="font-size:1.6rem">${esc(o.w)}</span>`, (ok) => {
            // After answering, practise saying both words
            stage.insertAdjacentHTML("beforeend", `
              <div class="sd-section" style="text-align:left">
                <b>ลองพูดทั้งสองคำให้ต่างกัน:</b>
                <div class="words-row" style="margin-top:6px">
                  ${q.options.map((o) => `<button class="word-chip" data-word="${esc(o.w)}">${o.e} <span class="en">${esc(o.w)}</span> 🔊</button>`).join("")}
                </div>
                <div class="row-btns"><button class="btn primary" id="nextQ">ข้อต่อไป ➡️</button></div>
              </div>`);
            $$(".word-chip", stage).forEach((c) => c.onclick = () => playWord(c.dataset.word, { rate: 0.7 }));
            $("#nextQ").onclick = (e) => { e.target.disabled = true; done(ok); };
          });
        },
      });
    });
  }

  // 4) Action riddle: see an action, guess the sound
  function action() {
    const pool = soundPool();
    runQuiz({
      title: "🙌 ท่ามือปริศนา", gameKey: "action",
      makeRound: () => {
        const s = pick(pool);
        return { s, options: shuffle([s, ...shuffle(pool.filter((x) => x.g !== s.g)).slice(0, 3)]) };
      },
      renderRound: (q, stage, done) => {
        stage.innerHTML = `
          <div class="prompt-emoji action-emoji">${q.s.action.emoji}</div>
          <p class="prompt-text"><b>${esc(q.s.action.name)}</b><br><small>${esc(q.s.action.how.replace(/\(?[A-Za-z][A-Za-z\s\-!']*\)?/g, "… "))}</small></p>
          <p>👉 ลุกขึ้นทำท่านี้ไปด้วย! ท่านี้คือเสียงอะไร?</p>`;
        choiceButtons(stage, q.options, q.s, (o) => `<span class="en">${esc(o.g)}</span>`, done, () => speakSound(q.s));
      },
    });
  }

  // 5) Say it: speech recognition
  function say() {
    const lv = maxLevel();
    const words = shuffle(BLEND_WORDS.filter((w) => w.level <= lv)).slice(0, 6);
    runQuiz({
      title: "🎤 พูดให้ไมค์ฟัง", gameKey: "say", rounds: words.length,
      makeRound: (k) => words[k],
      renderRound: (w, stage, done) => {
        let tries = 0;
        stage.innerHTML = `
          <div class="prompt-emoji">${w.emoji}</div>
          <div class="big-word">${esc(w.word)}</div>
          <div class="row-btns" style="justify-content:center">
            <button class="btn" id="hearW">🔊 ฟังต้นแบบ</button>
            <button class="btn" id="segW">🐢 ฟังช้าๆ</button>
          </div>
          <button class="mic-ring" id="micBtn">🎤</button>
          <p class="heard" id="heard">กดไมค์แล้วพูดคำนี้ (มีโอกาส 3 ครั้ง)</p>
          <button class="btn" id="skipW">ข้าม ⏭️</button>`;
        $("#hearW").onclick = () => playWord(w.word);
        $("#segW").onclick = () => speakSegmented(w.parts, w.word);
        $("#skipW").onclick = () => done(false);
        const out = $("#heard");
        $("#micBtn").onclick = () => {
          const mic = $("#micBtn");
          if (!canListen()) {
            out.innerHTML = `เบราว์เซอร์นี้ตรวจเสียงไม่ได้ ให้พ่อแม่ตัดสิน:
              <button class="btn ok" id="jY">👍 ถูก</button> <button class="btn" id="jN">🔁 ยังไม่ถูก</button>`;
            $("#jY").onclick = () => { sfx("ok"); confettiSmall(); done(true); };
            $("#jN").onclick = () => { tries++; if (tries >= 3) done(false); else out.textContent = "ลองอีกครั้งนะ 💪"; };
            return;
          }
          mic.classList.add("listening"); out.textContent = "👂 กำลังฟัง...";
          listen({
            onResult: (alts) => {
              if (matches(alts, w.word)) { out.textContent = `🎉 ถูกต้อง! "${alts[0]}"`; sfx("ok"); confettiSmall(); done(true); }
              else {
                tries++;
                sfx("bad");
                out.textContent = tries >= 3 ? `ได้ยินว่า "${alts[0]}" — ไม่เป็นไร ไปข้อต่อไปกัน!` : `ได้ยินว่า "${alts[0]}" 🤔 ลองใหม่ (${3 - tries} ครั้ง)`;
                if (tries >= 3) done(false);
              }
            },
            onError: (e) => {
              if (isBlocked(e)) { srBlocked = true; mic.classList.remove("listening"); mic.click(); return; }
              out.textContent = "ไม่ได้ยินเลย ลองพูดดังๆ อีกครั้ง";
            },
            onEnd: () => mic.classList.remove("listening"),
          });
        };
      },
    });
  }

  // 6) Family battle: take turns doing actions & guessing, timed
  function family() {
    const players = [
      { name: state.name || "ลูก", emoji: "🧒", pts: 0 },
      { name: "พ่อ/แม่", emoji: "🧑", pts: 0 },
    ];
    let turn = 0, round = 0, timer = null;
    const ROUNDS = 10;
    const pool = soundPool(10);

    function render() {
      if (round >= ROUNDS) return end();
      const p = players[turn];
      const guesser = players[1 - turn];
      const s = pick(pool);
      area().innerHTML = `
        <div class="game-head"><button class="btn" id="gBack">⬅️ กลับ</button><h2>👨‍👩‍👧 แข่งกับพ่อแม่</h2><small>รอบ ${round + 1}/${ROUNDS}</small></div>
        <div class="game-stage">
          <div class="score-board">
            ${players.map((pl, k) => `<div class="player ${k === turn ? "turn" : ""}">${pl.emoji} <b>${esc(pl.name)}</b><div class="pts">${pl.pts}</div></div>`).join("")}
          </div>
          <p class="prompt-text">ตาของ <b>${esc(p.name)}</b> ${p.emoji} — ดูการ์ดลับ แล้ว <b>ทำท่ามือ (ห้ามพูด!)</b><br>ให้ <b>${esc(guesser.name)}</b> ทายเสียง</p>
          <div class="secret-card hidden-card" id="secret">
            <div class="grapheme en">${esc(s.g)}</div>
            <div style="font-size:2.4rem">${s.action.emoji}</div>
            <b>${esc(s.action.name)}</b><br><small>${esc(s.action.how)}</small>
          </div>
          <div class="row-btns" style="justify-content:center">
            <button class="btn" id="peek">👀 กดค้างเพื่อดูการ์ด</button>
            <button class="btn primary" id="startT">⏱️ เริ่มจับเวลา 20 วิ</button>
          </div>
          <div class="timer" id="timer">20</div>
          <div class="row-btns" style="justify-content:center">
            <button class="btn ok big" id="gotIt">✅ ทายถูก!</button>
            <button class="btn big" id="miss">❌ ผ่าน</button>
          </div>
        </div>`;
      $("#gBack").onclick = () => { clearInterval(timer); showGameMenu(); };
      const sec = $("#secret");
      const show = () => sec.classList.remove("hidden-card"), hide = () => sec.classList.add("hidden-card");
      const peek = $("#peek");
      peek.addEventListener("pointerdown", show);
      ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => peek.addEventListener(ev, hide));
      let t = 20;
      $("#startT").onclick = () => {
        clearInterval(timer); t = 20; $("#timer").textContent = t;
        timer = setInterval(() => {
          t--; $("#timer").textContent = t;
          if (t <= 5 && t > 0) sfx("tap");
          if (t <= 0) { clearInterval(timer); sfx("bad"); toast("หมดเวลา! ⏰"); }
        }, 1000);
      };
      const finishTurn = (ok) => {
        clearInterval(timer);
        if (ok) {
          const bonus = t > 10 ? 2 : 1;
          p.pts += bonus; guesser.pts += 1;
          sfx("ok"); toast(`เยี่ยม! เสียง "${s.g}" ${s.action.emoji} (+${bonus} คนทำท่า, +1 คนทาย)`);
        } else { toast(`เฉลย: เสียง "${s.g}" ${s.action.emoji}`); }
        speakSound(s);
        round++; turn = 1 - turn;
        setTimeout(render, 1600);
      };
      $("#gotIt").onclick = () => finishTurn(true);
      $("#miss").onclick = () => finishTurn(false);
    }
    function end() {
      const kid = players[0], parent = players[1];
      const winner = kid.pts === parent.pts ? null : kid.pts > parent.pts ? kid : parent;
      addStars(Math.min(5, Math.ceil(kid.pts / 3) + 1));
      confetti(); sfx("win");
      area().innerHTML = `
        <div class="game-stage end-screen">
          <div class="trophy">${winner ? "🏆" : "🤝"}</div>
          <h2>${winner ? `${esc(winner.name)} ชนะ!` : "เสมอกัน! เก่งทั้งคู่"}</h2>
          <div class="score-board">${players.map((pl) => `<div class="player">${pl.emoji} <b>${esc(pl.name)}</b><div class="pts">${pl.pts}</div></div>`).join("")}</div>
          <p>ทุกคนได้ฝึกท่ามือ + ออกเสียงด้วยกัน 💛</p>
          <div class="row-btns" style="justify-content:center">
            <button class="btn primary big" id="gAgain">🔁 แข่งอีก</button>
            <button class="btn big" id="gMenu">🎮 เกมอื่น</button>
          </div>
        </div>`;
      $("#gAgain").onclick = family;
      $("#gMenu").onclick = showGameMenu;
    }
    render();
  }

  // ================= Stickers & progress =================
  function renderStickers() {
    $("#stickerGrid").innerHTML = STICKERS.map((s) => {
      const open = state.stars >= s.cost;
      return `<div class="sticker ${open ? "" : "locked"}"><div class="se">${s.e}</div><b>${open ? esc(s.name) : "???"}</b>
        <small>${open ? "ปลดล็อกแล้ว!" : `ต้องใช้ ${s.cost} ⭐`}</small></div>`;
    }).join("");
    const learned = SOUNDS.filter((s) => state.learned[s.g]).length;
    const actions = Object.keys(state.practiced).filter((k) => k.endsWith(":action")).length;
    const said = Object.keys(state.practiced).filter((k) => k.endsWith(":say")).length;
    const gameNames = { detective: "🕵️ นักสืบเสียง", blend: "🧪 ผสมเสียง", tricky: "👯 คู่แฝดหลอกหู", action: "🙌 ท่ามือปริศนา", say: "🎤 พูดให้ไมค์ฟัง" };
    $("#progressList").innerHTML = `
      <div class="prog-item">🔤 เรียนแล้ว <b>${learned}/${SOUNDS.length}</b> เสียง<div class="bar"><i style="width:${(learned / SOUNDS.length) * 100}%"></i></div></div>
      <div class="prog-item">🙌 ทำท่ามือได้ <b>${actions}/${SOUNDS.length}</b> ท่า<div class="bar"><i style="width:${(actions / SOUNDS.length) * 100}%;background:#b892ff"></i></div></div>
      <div class="prog-item">🎤 ออกเสียงผ่าน <b>${said}/${SOUNDS.length}</b> เสียง<div class="bar"><i style="width:${(said / SOUNDS.length) * 100}%;background:#f15bb5"></i></div></div>
      ${Object.entries(gameNames).map(([k, n]) => `<div class="prog-item">${n} — คะแนนสูงสุด <b>${state.games[k] ?? "-"}</b></div>`).join("")}`;
  }

  // ================= Settings =================
  $("#settingsBtn").onclick = () => {
    $("#kidName").value = state.name;
    $("#rateRange").value = state.rate;
    $("#rateVal").textContent = state.rate + "x";
    $("#sfxToggle").checked = state.sfx;
    loadVoices();
    openModal($("#settingsModal"));
  };
  $("#kidName").oninput = (e) => { state.name = e.target.value.trim(); save(); };
  $("#voiceSelect").onchange = (e) => { state.voiceURI = e.target.value; save(); };
  $("#rateRange").oninput = (e) => { state.rate = +e.target.value; $("#rateVal").textContent = state.rate + "x"; save(); };
  $("#sfxToggle").onchange = (e) => { state.sfx = e.target.checked; save(); };
  $("#testVoice").onclick = () => speak("Hello! s s s, snake. c a t, cat!");
  let resetArmed = false;
  $("#resetBtn").onclick = (e) => {
    // two-tap confirm (window.confirm is blocked in some embedded viewers)
    if (!resetArmed) {
      resetArmed = true; e.target.textContent = "⚠️ แตะอีกครั้งเพื่อยืนยัน";
      setTimeout(() => { resetArmed = false; e.target.textContent = "🗑️ ล้างความก้าวหน้า"; }, 4000);
      return;
    }
    resetArmed = false; e.target.textContent = "🗑️ ล้างความก้าวหน้า";
    state = { ...defaults, name: state.name, voiceURI: state.voiceURI, rate: state.rate, sfx: state.sfx };
    save(); renderAll(); toast("ล้างข้อมูลแล้ว เริ่มใหม่กันเลย!");
  };

  // ================= Toast & confetti =================
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let parts = [], raf = null;
  function confetti(n = 140) {
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ["#ff7a59", "#ffb703", "#06d6a0", "#8ecae6", "#b892ff", "#f15bb5"];
    for (let i = 0; i < n; i++) parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight / 3,
      vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 4, s: Math.random() * 8 + 4,
      c: pick(colors), r: Math.random() * 6, life: 120,
    });
    if (!raf) tick();
  }
  const confettiSmall = () => confetti(50);
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += 0.1; p.life--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); cx.restore();
    });
    parts = parts.filter((p) => p.life > 0 && p.y < cv.height + 20);
    raf = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0, 0, cv.width, cv.height), null);
  }

  // ================= Init =================
  function renderCredits() {
    const el = $("#audioCredits");
    if (!el) return;
    const credits = typeof AUDIO_CREDITS !== "undefined" ? AUDIO_CREDITS : [];
    const n = Object.keys(BUNDLED).length;
    el.innerHTML = credits.length
      ? `<p>มีเสียงคนจริงจาก Wikimedia Commons ${n} ไฟล์ ขอบคุณเจ้าของเสียงทุกท่าน (แต่ละไฟล์ใช้ตามสัญญาอนุญาตที่ระบุ — CC BY-SA ต้องแชร์ต่อด้วยสัญญาเดียวกัน)</p><ul class="credit-list">${credits.map((c) =>
          `<li><b class="en">${esc(c.title)}</b> — ${esc(/^unknown$|no machine-readable/i.test(c.author) ? "ดูชื่อผู้อัดที่หน้าต้นฉบับ" : c.author)} · ${esc(c.license)} · <a href="${esc(c.source)}" target="_blank" rel="noopener">ที่มา</a></li>`).join("")}</ul>`
      : `<p>ตอนนี้ยังไม่มีไฟล์เสียงคนจริงแนบมา แอปจึงใช้ <b>เสียงพ่อแม่</b> (ถ้าอัดไว้) หรือเสียงสังเคราะห์ของเบราว์เซอร์</p>`;
  }
  function renderAll() { renderStats(); renderJourney(); renderSoundGroups(); renderStickers(); renderCredits(); }
  renderAll();
})();
