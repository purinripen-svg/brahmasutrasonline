import {
    describe,
    it,
    expect
} from "vitest";

import {
    buildSearchIndex,
    search,
    clearIndex
} from "../js/services/searchService.js";

describe("searchService", () => {

    it("can clear its index", () => {

        clearIndex();

        expect(
            search("brahma")
        ).toEqual([]);

    });

});
