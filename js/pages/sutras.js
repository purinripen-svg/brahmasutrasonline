/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Browse Sūtras Page
 * File: js/pages/sutras.js
 * Version: 0.1.0
 * ============================================================================
 */

import { getAllSutras } from "../data-loader.js";
import { search } from "../search.js";
import { createSutraCard } from "../components/sutraCard.js";

let allSutras = [];

/**
 * Escape HTML before rendering.
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
 * Render sutra list.
 *
 * @param {Array} sutras
 */
function renderList(sutras) {

    const container =
        document.getElementById("sutra-list");

    if (!container)
        return;

    if (sutras.length === 0) {

        container.innerHTML = `
            <p class="empty">
                No matching sūtras found.
            </p>
        `;

        return;
    }

    container.innerHTML =
        sutras
            .map(sutra => createSutraCard(sutra))
            .join("");
}

/**
 * Search handler.
 */
async function handleSearch(event) {

    const query =
        event.target.value.trim();

    if (!query) {
        renderList(allSutras);
        return;
    }

    const results =
        await search(query);

    renderList(results);
}

/**
 * Initialize page.
 */
export async function initializeSutrasPage() {

    allSutras =
        await getAllSutras();

    renderList(allSutras);

    const input =
        document.getElementById("search-input");

    if (input) {

        input.addEventListener(
            "input",
            handleSearch
        );

    }

}
