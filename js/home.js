/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Home Page Module
 * Version: 0.1.0
 * ============================================================================
 */

import { getDailySutra } from "../data-loader.js";

/**
 * Escape HTML to prevent XSS.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

/**
 * Render the Sūtra of the Day.
 *
 * @param {string} containerId
 * @returns {Promise<void>}
 */
export async function renderDailySutra(containerId = "daily-sutra") {

    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    try {
        const sutra = await getDailySutra();

        if (!sutra) {
            container.innerHTML = "<p>No sūtra available.</p>";
            return;
        }

        container.innerHTML = `
            <article class="daily-sutra-card">
                <header>
                    <h2>Sūtra of the Day</h2>
                    <p class="sutra-number">${escapeHtml(sutra.sutraNumber)}</p>
                </header>

                <section class="sutra-text">
                    <p class="sanskrit">${escapeHtml(sutra.sanskrit)}</p>
                    <p class="iast">${escapeHtml(sutra.iast)}</p>
                    <p class="translation">${escapeHtml(sutra.translation)}</p>
                </section>

                <footer>
                    <a
                        class="button"
                        href="sutra.html?id=${encodeURIComponent(sutra.id)}"
                    >
                        Read More →
                    </a>
                </footer>
            </article>
        `;

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p class="error">
                Unable to load today's sūtra.
            </p>
        `;
    }
}
