/*
 * ==========================================================================
 * BrahmaSutrasOnline
 * js/app.js
 * Version: 0.1.0
 *
 * Uses the data-loader API for dataset access and navigation.
 * ==========================================================================
 */

'use strict';

import { getDailySutra, getSutraById, getNextSutra, getPreviousSutra } from './data-loader.js';

let currentSutra = null;

/**
 * Load the sutra for today using the data-loader API.
 */
async function loadData() {
    try {
        const sutra = await getDailySutra();
        currentSutra = sutra || null;
        if (sutra) renderSutra(sutra);
        else showLoadError();

    } catch (error) {
        console.error('Unable to load data:', error);
        showLoadError();
    }
}

function showLoadError() {
    const container = document.getElementById('daily-sutra');
    if (container) {
        container.innerHTML = `
            <div class="error">
                Unable to load the Brahma Sūtras dataset.
            </div>
        `;
    }
}

/**
 * Render a sutra object safely.
 * @param {Object} sutra
 */
function renderSutra(sutra) {
    const container = document.getElementById('daily-sutra');
    if (!container) return;

    container.setAttribute('aria-live', 'polite');

    try {
        while (container.firstChild) container.removeChild(container.firstChild);

        const h2 = document.createElement('h2');
        h2.textContent = sutra.sutraNumber != null ? String(sutra.sutraNumber) : '';

        const sanskritDiv = document.createElement('div');
        sanskritDiv.className = 'sanskrit';
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
        console.error('Error rendering sutra:', e);
        container.textContent = 'Error displaying sutra.';
    }
}

/**
 * Show next sutra (if available) and update currentSutra.
 */
async function showNextSutra() {
    if (!currentSutra || currentSutra.id == null) return;
    try {
        const next = await getNextSutra(currentSutra.id);
        if (next) {
            currentSutra = next;
            renderSutra(next);
        }
    } catch (e) {
        console.error('Failed to load next sutra:', e);
    }
}

/**
 * Show previous sutra (if available) and update currentSutra.
 */
async function showPreviousSutra() {
    if (!currentSutra || currentSutra.id == null) return;
    try {
        const prev = await getPreviousSutra(currentSutra.id);
        if (prev) {
            currentSutra = prev;
            renderSutra(prev);
        }
    } catch (e) {
        console.error('Failed to load previous sutra:', e);
    }
}

/**
 * Wire up navigation buttons if present.
 */
function setupNavigation() {
    const nextBtn = document.getElementById('sutra-next');
    const prevBtn = document.getElementById('sutra-prev');

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); showNextSutra(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); showPreviousSutra(); });
}

/**
 * Initialize app.
 */
document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    await loadData();
});

// App version log (append init snippet)
const APP_VERSION = '0.1.0';

function initApp() {
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    console.info(`BrahmaSutrasOnline v${APP_VERSION}`);
  });
}

// Run initialization
initApp();
