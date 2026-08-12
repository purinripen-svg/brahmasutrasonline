/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Footer Component
 * File: js/components/footer.js
 * Version: 0.1.0
 * ============================================================================
 */

import { CONFIG } from "../config.js";

/**
 * Render the site footer.
 *
 * @param {string} containerId
 */
export function renderFooter(containerId = "site-footer") {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    const year =
        new Date().getFullYear();

    container.innerHTML = `
        <footer class="site-footer">

            <section class="footer-brand">

                <h2>${CONFIG.site.name}</h2>

                <p>
                    ${CONFIG.site.tagline}
                </p>

            </section>

            <nav
                class="footer-links"
                aria-label="Footer Navigation"
            >

                <a href="about.html">About</a>

                <a href="glossary.html">Glossary</a>

                <a href="commentaries.html">Commentaries</a>

                <a href="resources.html">Resources</a>

                <a href="community.html">Community</a>

                <a href="contact.html">Contact</a>

            </nav>

            <section class="footer-meta">

                <p>
                    Version ${CONFIG.site.version}
                </p>

                <p>
                    © ${year} BrahmaSutrasOnline
                </p>

                <p>
                    Study. Understand. Contemplate.
                </p>

            </section>

        </footer>
    `;
}
