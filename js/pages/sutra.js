/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Individual Sutra Page
 * File: js/pages/sutra.js
 * Version: 0.1.0
 * ============================================================================
 */

import {
    getSutraById,
    getPreviousSutra,
    getNextSutra
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
 * Read id from URL.
 */
function getId() {

    const params =
        new URLSearchParams(window.location.search);

    return Number(params.get("id"));
}

/**
 * Render navigation.
 */
function navigation(previous, next) {

    return `
        <nav class="sutra-navigation">

            ${
                previous
                    ? `<a href="sutra.html?id=${previous.id}">
                        ← Previous
                       </a>`
                    : "<span></span>"
            }

            ${
                next
                    ? `<a href="sutra.html?id=${next.id}">
                        Next →
                       </a>`
                    : ""
            }

        </nav>
    `;
}

/**
 * Render page.
 */
export async function initializeSutraPage() {

    const id = getId();

    const container =
        document.getElementById("sutra-page");

    if (!container)
        return;

    const sutra =
        await getSutraById(id);

    if (!sutra) {

        container.innerHTML = `
            <h2>Sūtra not found</h2>
            <p>The requested sūtra does not exist.</p>
        `;

        return;
    }

    const previous =
        await getPreviousSutra(id);

    const next =
        await getNextSutra(id);

    container.innerHTML = `

        <article class="sutra">

            <header>

                <h1>
                    ${escapeHtml(sutra.sutraNumber)}
                </h1>

                <div class="sanskrit">
                    ${escapeHtml(sutra.sanskrit)}
                </div>

                <div class="iast">
                    ${escapeHtml(sutra.iast)}
                </div>

            </header>

            <section class="translation">

                <h2>Translation</h2>

                <p>
                    ${escapeHtml(sutra.translation)}
                </p>

            </section>

            ${
                sutra.summary
                    ? `
                    <section class="summary">

                        <h2>Summary</h2>

                        <p>
                            ${escapeHtml(sutra.summary)}
                        </p>

                    </section>
                    `
                    : ""
            }

            ${navigation(previous, next)}

        </article>

    `;
}
