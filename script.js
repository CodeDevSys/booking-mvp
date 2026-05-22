(function () {
  "use strict";

  const state = {
    step: 1,
    service: "Consultation",
    date: null,
    slot: null,
    offlineMode: false,
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
      if (n === "success") {
        s.classList.remove("active");
        s.classList.add("done");
        return;
      }
      s.classList.toggle("active", num === n);
      s.classList.toggle("done", typeof n === "number" && num < n);
    });
  }

  function showError(msg) {
    const existing = $(".error-toast");
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = "error-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  async function apiFetch(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        throw new Error("API not available");
      }
      throw new Error("Invalid server response");
    }
    return { res, data };
  }

  function generateClientSlots(dateStr) {
    const day = new Date(dateStr + "T12:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today || day.getDay() === 0 || day.getDay() === 6) return [];

    const slots = [];
    const start = new Date(day);
    start.setHours(9, 0, 0, 0);
    const end = new Date(day);
    end.setHours(17, 0, 0, 0);
    const now = Date.now();

    for (let t = new Date(start); t < end; t = new Date(t.getTime() + 30 * 60000)) {
      if (t.getTime() <= now) continue;
      slots.push({
        start: t.toISOString(),
        end: new Date(t.getTime() + 30 * 60000).toISOString(),
        label: t.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      });
    }
    return slots;
  }

  function renderSlots(slots) {
    const grid = $("#slots-grid");
    const timeNext = $("#time-next");
    grid.innerHTML = "";
    state.slot = null;
    timeNext.disabled = true;

    if (!slots.length) {
      grid.innerHTML = '<p class="empty">No times available this day. Try another date.</p>';
      return;
    }

    slots.forEach((slot) => {
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
  }

  function initDateInput() {
    const input = $("#date-input");
    if (!input) return;

    const today = new Date();
    input.min = today.toISOString().split("T")[0];
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
    if (!grid || !label) return;

    label.textContent = formatDateLabel(state.date);
    grid.innerHTML = '<p class="loading">Loading times…</p>';

    let slots = [];
    try {
      const { res, data } = await apiFetch(`/api/slots?date=${encodeURIComponent(state.date)}`);
      if (!res.ok) throw new Error(data.error || "Failed to load slots");
      slots = data.slots;
      state.offlineMode = false;
    } catch {
      slots = generateClientSlots(state.date);
      state.offlineMode = true;
      showError("Demo mode: times shown locally. Connect the API to save on the server.");
    }

    renderSlots(slots);
  }

  function updateSummary() {
    const el = $("#booking-summary");
    if (!el || !state.slot) return;
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
    const payload = {
      date: state.date,
      start: state.slot.start,
      name: String(fd.get("name")).trim(),
      email: String(fd.get("email")).trim(),
      notes: fd.get("notes"),
      service: state.service,
    };

    btn.disabled = true;
    btn.textContent = "Booking…";

    try {
      if (!state.offlineMode) {
        const { res, data } = await apiFetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(data.error || "Booking failed");
      } else {
        const list = JSON.parse(localStorage.getItem("bookings") || "[]");
        list.push({ ...payload, id: Date.now(), savedAt: new Date().toISOString() });
        localStorage.setItem("bookings", JSON.stringify(list));
      }

      const msg = state.offlineMode
        ? `${state.service} on ${formatDateLabel(state.date)} at ${state.slot.label}. Saved on this device (demo).`
        : `${state.service} on ${formatDateLabel(state.date)} at ${state.slot.label}. Confirmation sent to ${payload.email}.`;

      $("#success-message").textContent = msg;
      showStep("success");
    } catch (err) {
      showError(err.message || "Booking failed");
    } finally {
      btn.disabled = false;
      btn.textContent = "Confirm booking";
    }
  }

  function resetBooking() {
    state.service = "Consultation";
    state.date = null;
    state.slot = null;
    state.offlineMode = false;
    const dateInput = $("#date-input");
    if (dateInput) dateInput.value = "";
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

  const ADMIN_STORAGE = "booking_admin_key";

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = String(text);
    return d.innerHTML;
  }

  function formatWhen(start) {
    if (!start) return "—";
    return new Date(start).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function renderAdminBookings(bookings) {
    const container = $("#bookings-container");
    const count = $("#count-label");
    if (!container) return;

    if (!bookings.length) {
      container.innerHTML = '<p class="empty">No upcoming appointments yet.</p>';
      if (count) count.textContent = "0 appointments";
      return;
    }

    if (count) {
      count.textContent = `${bookings.length} appointment${bookings.length === 1 ? "" : "s"}`;
    }

    const rows = bookings
      .map(
        (b) => `<tr>
        <td>${formatWhen(b.start)}</td>
        <td>${escapeHtml(b.service || "—")}</td>
        <td>${escapeHtml(b.name || "—")}</td>
        <td>${escapeHtml(b.email || "—")}</td>
        <td>${escapeHtml(b.notes || "—")}</td>
      </tr>`
      )
      .join("");

    container.innerHTML = `<table class="bookings-table">
        <thead><tr><th>When</th><th>Service</th><th>Customer</th><th>Email</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody></table>`;
  }

  function setAdminStatus(message, type) {
    const el = $("#admin-status");
    if (!el) return;
    el.textContent = message || "";
    el.className = "admin-status" + (type ? ` ${type}` : "");
  }

  async function loadAdminBookings() {
    const key = sessionStorage.getItem(ADMIN_STORAGE) || "";
    const container = $("#bookings-container");
    if (!container) return;
    container.innerHTML = '<p class="loading">Loading appointments…</p>';

    try {
      const { res, data } = await apiFetch(`/api/bookings?key=${encodeURIComponent(key)}`);
      if (res.status === 401 || res.status === 503) {
        sessionStorage.removeItem(ADMIN_STORAGE);
        showAdminLogin();
        setAdminStatus(data.error || "Wrong password or ADMIN_KEY not set on Netlify.", "error");
        return false;
      }
      if (!res.ok) throw new Error(data.error || "Failed to load");
      renderAdminBookings(data.bookings || []);
      setAdminStatus("", "");
      return true;
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("bookings") || "[]");
      if (local.length) {
        renderAdminBookings(
          local.map((b) => ({
            ...b,
            service: b.service || "—",
            source: "demo (this device)",
          }))
        );
        setAdminStatus(
          "API unavailable — showing demo bookings from this browser only.",
          "error"
        );
        return true;
      }
      container.innerHTML = `<p class="empty">${escapeHtml(err.message)}</p>`;
      setAdminStatus(err.message, "error");
      return false;
    }
  }

  function showAdminLogin() {
    const login = $("#login-card");
    const list = $("#list-card");
    if (login) login.hidden = false;
    if (list) list.hidden = true;
  }

  function showAdminList() {
    const login = $("#login-card");
    const list = $("#list-card");
    if (login) login.hidden = true;
    if (list) list.hidden = false;
    list?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleAdminLogin() {
    const key = $("#admin-key")?.value.trim();
    const btn = $("#admin-login-btn");
    if (!key) {
      setAdminStatus("Please enter the admin key.", "error");
      return;
    }

    setAdminStatus("Checking…", "");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Checking…";
    }

    sessionStorage.setItem(ADMIN_STORAGE, key);
    showAdminList();

    const ok = await loadAdminBookings();

    if (btn) {
      btn.disabled = false;
      btn.textContent = "View appointments";
    }

    if (ok) {
      setAdminStatus("Signed in.", "ok");
    }
  }

  let managerReady = false;
  function initManager() {
    if (managerReady) {
      if (sessionStorage.getItem(ADMIN_STORAGE)) {
        showAdminList();
        loadAdminBookings();
      } else {
        showAdminLogin();
      }
      return;
    }
    managerReady = true;

    $("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAdminLogin();
    });

    $("#admin-login-btn")?.addEventListener("click", handleAdminLogin);

    $("#refresh-btn")?.addEventListener("click", loadAdminBookings);
    $("#logout-btn")?.addEventListener("click", () => {
      sessionStorage.removeItem(ADMIN_STORAGE);
      $("#admin-key").value = "";
      setAdminStatus("", "");
      showAdminLogin();
    });

    if (sessionStorage.getItem(ADMIN_STORAGE)) {
      showAdminList();
      loadAdminBookings();
    } else {
      showAdminLogin();
    }
  }

  function init() {
    const hasBooking = !!$("#booking-card");
    const hasManager = !!$("#manager-app");

    if (hasBooking) {
      initDateInput();
      setupNavigation();
      setupServices();

      const form = $("#details-form");
      if (form) form.addEventListener("submit", submitBooking);

      const again = $("#book-another");
      if (again) again.addEventListener("click", resetBooking);
    }

    if (hasManager) initManager();

    if (!hasBooking && !hasManager) return;

    window.__bookingAppReady = true;
    const warn = $("#js-warning");
    if (warn) warn.hidden = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
