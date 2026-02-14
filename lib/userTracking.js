"use client";

const EVENTS_KEY = "userTrackingEvents";
const SESSION_KEY = "userTrackingSessionId";

function isBrowser() {
  return typeof window !== "undefined";
}

function readEvents() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  if (!isBrowser()) return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-400)));
}

export function getTrackingSessionId() {
  if (!isBrowser()) return "server";
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = `sess-${Date.now()}`;
  localStorage.setItem(SESSION_KEY, created);
  return created;
}

export function trackEvent(type, payload = {}) {
  if (!isBrowser()) return;
  const events = readEvents();
  const event = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    sessionId: getTrackingSessionId(),
    path: window.location.pathname,
    userName: localStorage.getItem("userName") || "Guest",
    createdAt: new Date().toISOString(),
  };
  events.push(event);
  writeEvents(events);
}

export function trackPageView(pathname) {
  trackEvent("page_view", { pathname });
}

export function getTrackingSummary() {
  const events = readEvents();
  const recent = events.slice(-150);
  const eventCount = recent.length;
  const pageViews = recent.filter((item) => item.type === "page_view").length;
  const chatMessages = recent.filter((item) => item.type === "chat_send").length;
  const generationJobs = recent.filter(
    (item) => item.type === "admin_generate"
  ).length;

  const uniqueUsers = new Set(recent.map((item) => item.userName)).size;

  const byType = recent.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  return {
    eventCount,
    pageViews,
    chatMessages,
    generationJobs,
    uniqueUsers,
    byType,
    lastEventAt: recent[recent.length - 1]?.createdAt || null,
  };
}
