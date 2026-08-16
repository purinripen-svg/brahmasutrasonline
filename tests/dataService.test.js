import {
    describe,
    it,
    expect,
    beforeEach,
    vi
} from "vitest";

import {
    getIndex,
    getSutra,
    clearCache
} from "../js/services/dataService.js";

describe("dataService", () => {

    beforeEach(() => {
        clearCache();
        vi.restoreAllMocks();
    });

    it("loads the corpus index", async () => {

        const mockIndex = {
            schemaVersion: "1.0.0",
            totalSutras: 1,
            records: [
                {
                    id: "BS-1-1-1",
                    number: "1.1.1"
                }
            ]
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockIndex)
            })
        );

        const result = await getIndex();

        expect(result).toEqual(mockIndex);
    });

    it("throws when a sūtra does not exist", async () => {

        const mockIndex = {
            records: []
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockIndex)
            })
        );

        await expect(
            getSutra("BS-9-9-9")
        ).rejects.toThrow("Sutra not found");
    });

});
