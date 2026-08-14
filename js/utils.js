/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Utility Functions
 * File: js/utils.js
 * Version: 0.1.0
 * ============================================================================
 */

/**
 * Escape HTML to prevent XSS.
 *
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Normalize searchable text.
 *
 * Lowercase
 * Remove extra spaces
 *
 * @param {string} value
 * @returns {string}
 */
export function normalizeText(value) {

    return String(value ?? "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}

/**
 * Get URL query parameter.
 *
 * @param {string} key
 * @returns {string|null}
 */
export function getQueryParam(key) {

    const params =
        new URLSearchParams(window.location.search);

    return params.get(key);

}

/**
 * Safely convert to integer.
 *
 * @param {string|number} value
 * @returns {number|null}
 */
export function toInteger(value) {

    const number =
        Number(value);

    return Number.isInteger(number)
        ? number
        : null;

}

/**
 * Debounce helper.
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(callback, delay = 250) {

    let timer = null;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/**
 * Format today's date.
 *
 * @returns {string}
 */
export function todayISO() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}
