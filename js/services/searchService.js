import { getIndex } from "./dataService.js";

let searchIndex = [];

export async function buildSearchIndex() {
    const corpus = await getIndex();

    searchIndex = corpus.records.map(record => ({
        ...record,

        searchText: [
            record.number,
            record.title,
            record.slug,
            ...(record.keywords || [])
        ]
            .join(" ")
            .toLocaleLowerCase()
    }));
}

export function search(query) {
    const normalized = query
        .trim()
        .toLocaleLowerCase();

    if (!normalized) {
        return searchIndex;
    }

    return searchIndex.filter(record =>
        record.searchText.includes(normalized)
    );
}

export function clearIndex() {
    searchIndex = [];
}
