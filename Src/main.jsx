import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Polyfill for window.storage — the key/value API the store uses to save
 * leads, orders and reviews. Inside claude.ai this is provided by the
 * platform; once deployed on your own domain, this shim backs it with
 * the browser's localStorage instead so everything keeps working.
 *
 * Note: localStorage is per-browser, not a shared database. Two
 * different customers on two different devices will NOT see each
 * other's orders/reviews. For a real multi-customer store, swap this
 * shim out for calls to your own backend (e.g. Supabase, Firebase, or
 * a small API) using the same get/set/delete/list method shapes.
 */
window.storage = {
  async get(key, shared = false) {
    const k = (shared ? "shared:" : "priv:") + key;
    const value = localStorage.getItem(k);
    if (value === null) throw new Error(`Key not found: ${key}`);
    return { key, value, shared };
  },
  async set(key, value, shared = false) {
    const k = (shared ? "shared:" : "priv:") + key;
    localStorage.setItem(k, value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    const k = (shared ? "shared:" : "priv:") + key;
    localStorage.removeItem(k);
    return { key, deleted: true, shared };
  },
  async list(prefix = "", shared = false) {
    const p = (shared ? "shared:" : "priv:") + prefix;
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(p))
      .map((k) => k.slice(shared ? 7 : 5));
    return { keys, prefix, shared };
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
