/**
 * ============================================================================
 * BrahmaSutrasOnline
 * Pagination Component
 * File: js/components/pagination.js
 * Version: 0.1.0
 * ============================================================================
 */

/**
 * Calculate pagination state.
 *
 * @param {number} totalItems
 * @param {number} currentPage
 * @param {number} pageSize
 * @returns {Object}
 */
export function paginate(totalItems, currentPage = 1, pageSize = 20) {

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / pageSize)
    );

    const page = Math.min(
        Math.max(currentPage, 1),
        totalPages
    );

    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, totalItems);

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        start,
        end,
        hasPrevious: page > 1,
        hasNext: page < totalPages
    };
}

/**
 * Slice data for current page.
 *
 * @param {Array} items
 * @param {Object} state
 * @returns {Array}
 */
export function pageItems(items, state) {
    return items.slice(state.start, state.end);
}

/**
 * Render pagination controls.
 *
 * @param {string} containerId
 * @param {Object} state
 * @param {Function} onPageChange
 */
export function renderPagination(
    containerId,
    state,
    onPageChange
) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = `
        <nav
            class="pagination"
            aria-label="Pagination"
        >

            <button
                ${state.hasPrevious ? "" : "disabled"}
                data-page="${state.page - 1}"
            >
                ← Previous
            </button>

            <span>
                Page ${state.page}
                of
                ${state.totalPages}
            </span>

            <button
                ${state.hasNext ? "" : "disabled"}
                data-page="${state.page + 1}"
            >
                Next →
            </button>

        </nav>
    `;

    container
        .querySelectorAll("button[data-page]")
        .forEach(button => {

            button.addEventListener("click", () => {

                onPageChange(
                    Number(button.dataset.page)
                );

            });

        });

}
