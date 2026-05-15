const state = {
  step: 1,
  service: "Consultation",
  date: null,const state = {
  step: 1,
  service: "Consultation",
  date: null,
  slot: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

async function apiFetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      throw new Error(
        "API not reachable. Redeploy on Netlify with the netlify/ folder and _redirects file."
      );
    }
    throw new Error("Invalid server response");
  }
  return { res, data };
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function showStep(n) {
  state.step = n;
  $$(".panel").forEach((p) => p.classList.remove("active"));
  const panel = $(`#panel-${n === "success" ? "success" : n}`);
  if (panel) panel.classList.add("active");

  $$(".step").forEach((s) => {
    const num = Number(s.dataset.step);
    s.classList.toggle("active", num === n);
    s.classList.toggle("done", typeof n === "number" && num < n);
  });
}

function showError(msg) {
  const existing = $(".error-toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.className = "error-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

function initDateInput() {
  const input = $("#date-input");
  const today = new Date();
  const min = today.toISOString().split("T")[0];
  input.min = min;

  const max = new Date(today);
  max.setDate(max.getDate() + 60);
  input.max = max.toISOString().split("T")[0];

  input.addEventListener("change", () => {
    state.date = input.value;
    const next = $("#date-next");
    const hint = $("#date-hint");

    if (!state.date) {
      next.disabled = true;
      return;
    }

    const day = new Date(state.date + "T12:00:00").getDay();
    if (day === 0 || day === 6) {
      hint.textContent = "Weekends are unavailable. Please pick a weekday.";
      next.disabled = true;
      state.date = null;
      return;
    }

    hint.textContent = formatDateLabel(state.date);
    next.disabled = false;
  });
}

async function loadSlots() {
  const grid = $("#slots-grid");
  const label = $("#selected-date-label");
  const timeNext = $("#time-next");

  label.textContent = formatDateLabel(state.date);
  grid.innerHTML = '<p class="loading">Loading times…</p>';
  timeNext.disabled = true;
  state.slot = null;

  try {
    const { res, data } = await apiFetch(`/api/slots?date=${state.date}`);
    if (!res.ok) throw new Error(data.error || "Failed to load slots");

    if (!data.slots.length) {
      grid.innerHTML = '<p class="empty">No times available this day. Try another date.</p>';
      return;
    }

    grid.innerHTML = "";
    data.slots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = slot.label;
      btn.dataset.start = slot.start;
      btn.addEventListener("click", () => {
        $$(".slot-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.slot = slot;
        timeNext.disabled = false;
      });
      grid.appendChild(btn);
    });
  } catch (err) {
    grid.innerHTML = '<p class="empty">Could not load times.</p>';
    showError(err.message);
  }
}

function updateSummary() {
  const el = $("#booking-summary");
  el.innerHTML = `
    <dl>
      <dt>Service</dt><dd>${state.service}</dd>
      <dt>Date</dt><dd>${formatDateLabel(state.date)}</dd>
      <dt>Time</dt><dd>${state.slot.label}</dd>
    </dl>
  `;
}

async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const btn = $("#submit-btn");
  const fd = new FormData(form);

  btn.disabled = true;
  btn.textContent = "Booking…";

  try {
    const { res, data } = await apiFetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: state.date,
        start: state.slot.start,
        name: fd.get("name"),
        email: fd.get("email"),
        notes: fd.get("notes"),
        service: state.service,
      }),
    });
    if (!res.ok) throw new Error(data.error || "Booking failed");

    $("#success-message").textContent = `${state.service} on ${formatDateLabel(state.date)} at ${state.slot.label}. A confirmation was sent to ${fd.get("email")}.`;
    showStep("success");
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Confirm booking";
  }
}

function resetBooking() {
  state.service = "Consultation";
  state.date = null;
  state.slot = null;
  $("#date-input").value = "";
  $("#date-hint").textContent = "";
  $("#date-next").disabled = true;
  $("#time-next").disabled = true;
  $$(".service-btn").forEach((b) => {
    b.classList.toggle("selected", b.dataset.service === "Consultation");
  });
  $("#details-form").reset();
  showStep(1);
}

function setupNavigation() {
  $$(".next-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const next = Number(btn.dataset.next);
      if (next === 3 && state.date) await loadSlots();
      if (next === 4) updateSummary();
      showStep(next);
    });
  });

  $$(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => showStep(Number(btn.dataset.back)));
  });
}

function setupServices() {
  $$(".service-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".service-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.service = btn.dataset.service;
    });
  });
}

function addChatMessage(text, role) {
  const box = $("#chat-messages");
  const msg = document.createElement("div");
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

async function handleChat(e) {
  e.preventDefault();
  const input = $("#chat-input");
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, "user");
  input.value = "";

  try {
    const { res, data } = await apiFetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        context: {
          service: state.service,
          date: state.date,
          step: state.step,
        },
      }),
    });
    if (!res.ok) throw new Error(data.error || "Chat failed");
    addChatMessage(data.reply, "bot");

    if (data.date) {
      $("#date-input").value = data.date;
      $("#date-input").dispatchEvent(new Event("change"));
      if (state.date) {
        showStep(2);
        if (data.time) {
          await loadSlots();
          showStep(3);
          const match = [...$$(".slot-btn")].find((b) => {
            const d = new Date(b.dataset.start);
            const h = String(d.getHours()).padStart(2, "0");
            const m = String(d.getMinutes()).padStart(2, "0");
            return `${h}:${m}` === data.time;
          });
          if (match) match.click();
        }
      }
    }
  } catch {
    addChatMessage("Something went wrong. Use the form to book.", "bot");
  }
}

async function init() {
  initDateInput();
  setupNavigation();
  setupServices();
  $("#details-form").addEventListener("submit", submitBooking);
  $("#book-another").addEventListener("click", resetBooking);
  $("#chat-form").addEventListener("submit", handleChat);

  addChatMessage("Hi! I can help you find a time, or you can use the steps on the left.", "bot");

  try {
    const { data: health } = await apiFetch("/api/health");
    const badge = $("#ai-badge");
    if (health.ai) {
      badge.textContent = "live";
      badge.classList.add("live");
    }
  } catch {
    /* server offline — fetch will fail on booking too */
  }
}

init();

  slot: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function showStep(n) {
  state.step = n;
  $$(".panel").forEach((p) => p.classList.remove("active"));
  const panel = $(`#panel-${n === "success" ? "success" : n}`);
  if (panel) panel.classList.add("active");

  $$(".step").forEach((s) => {
    const num = Number(s.dataset.step);
    s.classList.toggle("active", num === n);
    s.classList.toggle("done", typeof n === "number" && num < n);
  });
}

function showError(msg) {
  const existing = $(".error-toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.className = "error-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

function initDateInput() {
  const input = $("#date-input");
  const today = new Date();
  const min = today.toISOString().split("T")[0];
  input.min = min;

  const max = new Date(today);
  max.setDate(max.getDate() + 60);
  input.max = max.toISOString().split("T")[0];

  input.addEventListener("change", () => {
    state.date = input.value;
    const next = $("#date-next");
    const hint = $("#date-hint");

    if (!state.date) {
      next.disabled = true;
      return;
    }

    const day = new Date(state.date + "T12:00:00").getDay();
    if (day === 0 || day === 6) {
      hint.textContent = "Weekends are unavailable. Please pick a weekday.";
      next.disabled = true;
      state.date = null;
      return;
    }

    hint.textContent = formatDateLabel(state.date);
    next.disabled = false;
  });
}

async function loadSlots() {
  const grid = $("#slots-grid");
  const label = $("#selected-date-label");
  const timeNext = $("#time-next");

  label.textContent = formatDateLabel(state.date);
  grid.innerHTML = '<p class="loading">Loading times…</p>';
  timeNext.disabled = true;
  state.slot = null;

  try {
    const res = await fetch(`/api/slots?date=${state.date}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load slots");

    if (!data.slots.length) {
      grid.innerHTML = '<p class="empty">No times available this day. Try another date.</p>';
      return;
    }

    grid.innerHTML = "";
    data.slots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = slot.label;
      btn.dataset.start = slot.start;
      btn.addEventListener("click", () => {
        $$(".slot-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.slot = slot;
        timeNext.disabled = false;
      });
      grid.appendChild(btn);
    });
  } catch (err) {
    grid.innerHTML = '<p class="empty">Could not load times.</p>';
    showError(err.message);
  }
}

function updateSummary() {
  const el = $("#booking-summary");
  el.innerHTML = `
    <dl>
      <dt>Service</dt><dd>${state.service}</dd>
      <dt>Date</dt><dd>${formatDateLabel(state.date)}</dd>
      <dt>Time</dt><dd>${state.slot.label}</dd>
    </dl>
  `;
}

async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const btn = $("#submit-btn");
  const fd = new FormData(form);

  btn.disabled = true;
  btn.textContent = "Booking…";

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: state.date,
        start: state.slot.start,
        name: fd.get("name"),
        email: fd.get("email"),
        notes: fd.get("notes"),
        service: state.service,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Booking failed");

    $("#success-message").textContent = `${state.service} on ${formatDateLabel(state.date)} at ${state.slot.label}. A confirmation was sent to ${fd.get("email")}.`;
    showStep("success");
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Confirm booking";
  }
}

function resetBooking() {
  state.service = "Consultation";
  state.date = null;
  state.slot = null;
  $("#date-input").value = "";
  $("#date-hint").textContent = "";
  $("#date-next").disabled = true;
  $("#time-next").disabled = true;
  $$(".service-btn").forEach((b) => {
    b.classList.toggle("selected", b.dataset.service === "Consultation");
  });
  $("#details-form").reset();
  showStep(1);
}

function setupNavigation() {
  $$(".next-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const next = Number(btn.dataset.next);
      if (next === 3 && state.date) await loadSlots();
      if (next === 4) updateSummary();
      showStep(next);
    });
  });

  $$(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => showStep(Number(btn.dataset.back)));
  });
}

function setupServices() {
  $$(".service-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".service-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.service = btn.dataset.service;
    });
  });
}

function addChatMessage(text, role) {
  const box = $("#chat-messages");
  const msg = document.createElement("div");
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

async function handleChat(e) {
  e.preventDefault();
  const input = $("#chat-input");
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        context: {
          service: state.service,
          date: state.date,
          step: state.step,
        },
      }),
    });
    const data = await res.json();
    addChatMessage(data.reply, "bot");

    if (data.date) {
      $("#date-input").value = data.date;
      $("#date-input").dispatchEvent(new Event("change"));
      if (state.date) {
        showStep(2);
        if (data.time) {
          await loadSlots();
          showStep(3);
          const match = [...$$(".slot-btn")].find((b) => {
            const d = new Date(b.dataset.start);
            const h = String(d.getHours()).padStart(2, "0");
            const m = String(d.getMinutes()).padStart(2, "0");
            return `${h}:${m}` === data.time;
          });
          if (match) match.click();
        }
      }
    }
  } catch {
    addChatMessage("Something went wrong. Use the form to book.", "bot");
  }
}

async function init() {
  initDateInput();
  setupNavigation();
  setupServices();
  $("#details-form").addEventListener("submit", submitBooking);
  $("#book-another").addEventListener("click", resetBooking);
  $("#chat-form").addEventListener("submit", handleChat);

  addChatMessage("Hi! I can help you find a time, or you can use the steps on the left.", "bot");

  try {
    const res = await fetch("/api/health");
    const health = await res.json();
    const badge = $("#ai-badge");
    if (health.ai) {
      badge.textContent = "live";
      badge.classList.add("live");
    }
  } catch {
    /* server offline — fetch will fail on booking too */
  }
}

init();
