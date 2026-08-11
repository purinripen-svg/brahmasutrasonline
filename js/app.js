/*
 * BrahmaSutrasOnline
 * js/app.js
 * Version: 0.1.0
 */

'use strict';

const CONFIG = {
    dataFile: 'data/sample-sutras.json'
};

let sutraData = [];

/**
 * Load the JSON dataset.
 */
async function loadData() {
    try {
        const response = await fetch(CONFIG.dataFile);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        sutraData = json.sutras || [];

        renderDailySutra();

    } catch (error) {
        console.error('Unable to load data:', error);

        const container = document.getElementById('daily-sutra');

        if (container) {
            container.innerHTML = `
                <div class="error">
                    Unable to load the Brahma Sūtras dataset.
                </div>
            `;
        }
    }
}

/**
 * Returns today's Sutra (UTC-based day index for consistent rotation).
 */
function getDailySutra() {

    if (sutraData.length === 0)
        return null;

    // Use UTC day to keep the same sutra globally for the same UTC day
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    return sutraData[day % sutraData.length];
}

/**
 * Render Sutra of the Day safely (avoid innerHTML with untrusted data).
 */
function renderDailySutra() {

    const container = document.getElementById('daily-sutra');

    if (!container)
        return;

    // Mark that content may update dynamically for screen readers
    container.setAttribute('aria-live', 'polite');

    const sutra = getDailySutra();

    if (!sutra) {
        container.textContent = 'No sutra available.';
        return;
    }

    try {
        // Clear existing contents
        while (container.firstChild) container.removeChild(container.firstChild);

        const h2 = document.createElement('h2');
        h2.textContent = sutra.sutraNumber != null ? String(sutra.sutraNumber) : '';

        const sanskritDiv = document.createElement('div');
        sanskritDiv.className = 'sanskrit';
        // If Sanskrit text is used, it's helpful to mark the language
        sanskritDiv.lang = 'sa';
        sanskritDiv.textContent = sutra.sanskrit || '';

        const iastDiv = document.createElement('div');
        iastDiv.className = 'iast';
        iastDiv.textContent = sutra.iast || '';

        const p = document.createElement('p');
        p.textContent = sutra.translation || '';

        const a = document.createElement('a');
        a.className = 'button';
        const idVal = sutra.id != null ? String(sutra.id) : '';
        a.href = `sutra.html?id=${encodeURIComponent(idVal)}`;
        a.textContent = 'Study this Sūtra →';

        container.appendChild(h2);
        container.appendChild(sanskritDiv);
        container.appendChild(iastDiv);
        container.appendChild(p);
        container.appendChild(a);

    } catch (e) {
        console.error('Error rendering daily sutra:', e);
        container.textContent = 'Error displaying sutra.';
    }
}

/**
 * Initialize app.
 */
document.addEventListener(
    'DOMContentLoaded',
    loadData
);
