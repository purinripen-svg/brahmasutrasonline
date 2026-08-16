import {
    describe,
    it,
    expect
} from "vitest";

import { renderSutraCard }
    from "../js/components/sutraCard.js";

describe("sutraCard", () => {

    it("renders a sūtra card", () => {

        const sutra = {
            id: "BS-1-1-1",
            number: "1.1.1",
            title: "Atha Ato Brahma Jijñāsā",

            text: {
                sanskrit:
                    "अथातो ब्रह्मजिज्ञासा",

                iast:
                    "athāto brahmajijñāsā"
            }
        };

        const card =
            renderSutraCard(sutra);

        expect(
            card.textContent
        ).toContain("1.1.1");

        expect(
            card.textContent
        ).toContain(
            "अथातो ब्रह्मजिज्ञासा"
        );

        expect(
            card.textContent
        ).toContain(
            "athāto brahmajijñāsā"
        );
    });

});
