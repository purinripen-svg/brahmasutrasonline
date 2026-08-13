/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Sutra Card Component
 * File: js/components/sutraCard.js
 * Version: 0.1.0
 * ============================================================================
 */

/**
 * Escape HTML to prevent XSS.
 *
 * @param {string} value
 * @returns {string}
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
 * Create a reusable Sūtra card.
 *
 * @param {Object} sutra
 * @param {Object} [options]
 * @param {boolean} [options.showSummary=true]
 * @param {string} [options.buttonText="Study"]
 * @returns {string}
 */
export function createSutraCard(
    sutra,
    {
        showSummary = true,
        buttonText = "Study"
    } = {}
) {
    return `
        <article class="sutra-card" data-sutra-id="${escapeHtml(String(sutra.id ?? ""))}">

            <header class="sutra-card__header">
                <span class="sutra-card__number">
                    ${escapeHtml(sutra.sutraNumber ?? "")}
                </span>
            </header>

            <div class="sutra-card__body">

                <p class="sutra-card__sanskrit">
                    ${escapeHtml(sutra.sanskrit ?? "")}
                </p>

                <p class="sutra-card__iast">
                    ${escapeHtml(sutra.iast ?? "")}
                </p>

                <p class="sutra-card__translation">
                    ${escapeHtml(sutra.translation ?? "")}
                </p>

                ${
                    showSummary && sutra.summary
                        ? `
                        <p class="sutra-card__summary">
                            ${escapeHtml(sutra.summary)}
                        </p>
                        `
                        : ""
                }

            </div>

            <footer class="sutra-card__footer">

                <a
                    class="button"
                    href="sutra.html?id=${encodeURIComponent(sutra.id ?? "") }"
                    aria-label="Read Sūtra ${escapeHtml(sutra.sutraNumber ?? "") }"
                >
                    ${escapeHtml(buttonText)}
                </a>

            </footer>

        </article>
    `;
}
