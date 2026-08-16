import { getIndex } from "../services/dataService.js";
import {
    buildSearchIndex,
    search
} from "../services/searchService.js";
import { renderSutraCard } from "../components/sutraCard.js";

const PAGE_SIZE = 20;

const state = {
    records: [],
    results: [],
    page: 1,
    query: "",
    adhyaya: "",
    pada: ""
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
    cacheElements();
    bindEvents();

    try {
        const index = await getIndex();

        state.records = index.records;

        await buildSearchIndex();

        applyFilters();

    } catch (error) {
        console.error(error);
        showError(
            "Unable to load the Sūtra collection. Please try again later."
        );
    }
}

function cacheElements() {
    elements.search = document.querySelector("#sutra-search");
    elements.adhyaya = document.querySelector("#adhyaya-filter");
    elements.pada = document.querySelector("#pada-filter");
    elements.list = document.querySelector("#sutra-list");
    elements.count = document.querySelector("#result-count");
    elements.pagination = document.querySelector("#pagination");
    elements.error = document.querySelector("#sutra-error");
}

function bindEvents() {
    elements.search.addEventListener("input", handleSearch);

    elements.adhyaya.addEventListener(
        "change",
        handleFilterChange
    );

    elements.pada.addEventListener(
        "change",
        handleFilterChange
    );
}

function handleSearch(event) {
    state.query = event.target.value;
    state.page = 1;

    applyFilters();
}

function handleFilterChange() {
    state.adhyaya = elements.adhyaya.value;
    state.pada = elements.pada.value;
    state.page = 1;

    applyFilters();
}

function applyFilters() {
    let results = state.query
        ? search(state.query)
        : state.records;

    if (state.adhyaya) {
        results = results.filter(
            item => String(item.adhyaya) === state.adhyaya
        );
    }

    if (state.pada) {
        results = results.filter(
            item => String(item.pada) === state.pada
        );
    }

    state.results = results;

    render();
}

function render() {
    renderCount();
    renderResults();
    renderPagination();
}

function renderCount() {
    const count = state.results.length;

    elements.count.textContent =
        `${count} ${count === 1 ? "sūtra" : "sūtras"} found`;
}

function renderResults() {
    elements.list.replaceChildren();

    const start =
        (state.page - 1) * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    const visibleResults =
        state.results.slice(start, end);

    if (visibleResults.length === 0) {
        const message = document.createElement("p");

        message.textContent =
            "No matching sūtras found.";

        elements.list.appendChild(message);

        return;
    }

    const fragment = document.createDocumentFragment();

    visibleResults.forEach(sutra => {
        fragment.appendChild(
            renderSutraCard(sutra)
        );
    });

    elements.list.appendChild(fragment);
}

function renderPagination() {
    elements.pagination.replaceChildren();

    const totalPages =
        Math.ceil(state.results.length / PAGE_SIZE);

    if (totalPages <= 1) {
        return;
    }

    const fragment =
        document.createDocumentFragment();

    if (state.page > 1) {
        fragment.appendChild(
            createPageButton(
                "← Previous",
                state.page - 1
            )
        );
    }

    for (let page = 1; page <= totalPages; page++) {
        fragment.appendChild(
            createPageButton(
                String(page),
                page
            )
        );
    }

    if (state.page < totalPages) {
        fragment.appendChild(
            createPageButton(
                "Next →",
                state.page + 1
            )
        );
    }

    elements.pagination.appendChild(fragment);
}

function createPageButton(label, page) {
    const button =
        document.createElement("button");

    button.type = "button";
    button.textContent = label;

    if (page === state.page) {
        button.setAttribute(
            "aria-current",
            "page"
        );
    }

    button.addEventListener("click", () => {
        state.page = page;

        render();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    return button;
}

function showError(message) {
    elements.error.textContent = message;
    elements.error.hidden = false;
}
