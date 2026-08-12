/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Search Module
 * Version: 0.1.0
 * ============================================================================
 */

import { getAllSutras } from "./data-loader.js";

/**
 * Normalize text for searching.
 *
 * - Lowercase
 * - Trim whitespace
 */
function normalize(text) {
    return String(text ?? "")
        .toLowerCase()
        .trim();
}

/**
 * Search the dataset.
 *
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchSutras(query) {

    const q = normalize(query);

    if (!q) {
        return [];
    }

    const sutras = await getAllSutras();

    return sutras.filter(sutra => {

        return [

            sutra.sutraNumber,

            sutra.sanskrit,

            sutra.iast,

            sutra.translation,

            ...(sutra.keywords || [])

        ].some(field =>
            normalize(field).includes(q)
        );

    });

}

/**
 * Highlight search matches.
 *
 * @param {string} text
 * @param {string} query
 * @returns {string}
 */
export function highlight(text, query) {

    if (!query)
        return text;

    const escaped =
        query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex =
        new RegExp(`(${escaped})`, "gi");

    return String(text)
        .replace(regex, "<mark>$1</mark>");
}
