/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Individual Sutra Page
 * File: js/pages/sutra.js
 * Version: 0.1.1
 * ============================================================================
 */

import {
  getSutraById,
  getPreviousSutra,
  getNextSutra,
} from "../data-loader.js";

/**
 * Escape HTML.
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Read id from URL and validate it.
 * Returns a number or null if invalid.
 */
function getId() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("id");
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || Number.isNaN(n)) return null;
  return n;
}

/**
 * Render navigation.
 */
function navigation(previous, next) {
  return `
        <nav class="sutra-navigation" aria-label="Sutra navigation">

            ${
    previous
      ? `<a href="sutra.html?id=${encodeURIComponent(previous.id)}" rel="prev">← Previous</a>`
      : `<span class="nav-placeholder" aria-hidden="true"></span>`
  }

            ${
    next
      ? `<a href="sutra.html?id=${encodeURIComponent(next.id)}" rel="next">Next →</a>`
      : ` <span class="nav-placeholder" aria-hidden="true"></span>`
  }

        </nav>
    `;
}

/**
 * Render an error or informational message into the container.
 */
function renderMessage(container, html, isError = false) {
  container.innerHTML = `<div class="sutra-message" role="status" aria-live="polite">${html}</div>`;
  if (isError) console.error(html);
}

/**
 * Render page.
 */
export async function initializeSutraPage() {
  const container = document.getElementById("sutra-page");
  if (!container) return;

  // Show loading state
  renderMessage(container, `<p>Loading…</p>`);

  const id = getId();
  if (id === null) {
    renderMessage(container, `<h2>Invalid Sūtra</h2><p>No valid sūtra id was provided.</p>`);
    return;
  }

  try {
    const sutra = await getSutraById(id);
    if (!sutra) {
      renderMessage(container, `<h2>Sūtra not found</h2><p>The requested sūtra does not exist.</p>`);
      return;
    }

    const previous = await getPreviousSutra(id);
    const next = await getNextSutra(id);

    // Update document title for SEO / usability
    try {
      document.title = `${sutra.sutraNumber} — BrahmaSutrasOnline`;
    } catch (e) {
      // ignore
    }

    // Render content (escaped)
    container.innerHTML = `
      <article class="sutra">

        <header>
          <h1 tabindex="-1">${escapeHtml(sutra.sutraNumber)}</h1>

          <div class="sanskrit">
            ${escapeHtml(sutra.sanskrit)}
          </div>

          <div class="iast">
            ${escapeHtml(sutra.iast)}
          </div>
        </header>

        <section class="translation">
          <h2>Translation</h2>
          <p>${escapeHtml(sutra.translation)}</p>
        </section>

        ${
      sutra.summary
        ? `
          <section class="summary">
            <h2>Summary</h2>
            <p>${escapeHtml(sutra.summary)}</p>
          </section>
        `
        : ""
    }

        ${navigation(previous, next)}

      </article>
    `;

    // Move focus to heading for accessibility
    const heading = container.querySelector("h1");
    if (heading && typeof heading.focus === "function") heading.focus();
  } catch (err) {
    console.error(err);
    renderMessage(container, `<h2>Error</h2><p>Unable to load the sūtra. Please try again later.</p>`, true);
  }
}
