/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Data Module
 * Version: 0.1.0
 *
 * Responsible for:
 * - Loading JSON data
 * - Caching
 * - Lookup
 * - Navigation
 * ============================================================================
 */

import { CONFIG } from "./config.js";

let cache = null;

/**
 * Load the dataset (cached after first load).
 * @returns {Promise<Array>}
 */
export async function loadData() {
    if (cache) {
        return cache;
    }

    const response = await fetch(CONFIG.data.file);

    if (!response.ok) {
        throw new Error(
            `Failed to load dataset (${response.status})`
        );
    }

    const json = await response.json();

    if (!json.sutras || !Array.isArray(json.sutras)) {
        throw new Error("Invalid dataset.");
    }

    cache = json.sutras;

    return cache;
}

/**
 * Get every sūtra.
 * @returns {Promise<Array>}
 */
export async function getAllSutras() {
    return await loadData();
}

/**
 * Find by numeric id.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function getSutraById(id) {

    const sutras = await loadData();

    return (
        sutras.find(
            s => s.id === Number(id)
        ) || null
    );
}

/**
 * Find by sutra number.
 * Example:
 * 1.1.1
 *
 * @param {string} number
 * @returns {Promise<Object|null>}
 */
export async function getSutraByNumber(number) {

    const sutras = await loadData();

    return (
        sutras.find(
            s => s.sutraNumber === number
        ) || null
    );
}

/**
 * Today's sūtra.
 *
 * @returns {Promise<Object>}
 */
export async function getDailySutra() {

    const sutras = await loadData();

    const days =
        Math.floor(
            Date.now() /
            86400000
        );

    return sutras[
        days % sutras.length
    ];
}

/**
 * Previous sūtra.
 */
export async function getPreviousSutra(id) {

    const sutras = await loadData();

    const index =
        sutras.findIndex(
            s => s.id === Number(id)
        );

    if (index <= 0)
        return null;

    return sutras[index - 1];
}

/**
 * Next sūtra.
 */
export async function getNextSutra(id) {

    const sutras = await loadData();

    const index =
        sutras.findIndex(
            s => s.id === Number(id)
        );

    if (
        index === -1 ||
        index >= sutras.length - 1
    ) {
        return null;
    }

    return sutras[index + 1];
}
