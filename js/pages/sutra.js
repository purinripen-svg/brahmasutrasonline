import { getSutra } from "../services/dataService.js";

const elements = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
    cacheElements();

    const params = new URLSearchParams(
        window.location.search
    );

    const id = params.get("id");

    if (!id) {
        showError("No sūtra was specified.");
        return;
    }

    try {
        const sutra = await getSutra(id);

        renderSutra(sutra);

    } catch (error) {
        console.error(error);

        showError(
            "The requested sūtra could not be found."
        );
    }
}

function cacheElements() {
    elements.loading =
        document.querySelector("#sutra-loading");

    elements.content =
        document.querySelector("#sutra-content");

    elements.error =
        document.querySelector("#sutra-error");

    elements.breadcrumb =
        document.querySelector("#breadcrumb-number");

    elements.number =
        document.querySelector("#sutra-number");

    elements.title =
        document.querySelector("#sutra-title");

    elements.sanskrit =
        document.querySelector("#sutra-sanskrit");

    elements.iast =
        document.querySelector("#sutra-iast");

    elements.translations =
        document.querySelector("#sutra-translations");

    elements.summary =
        document.querySelector("#sutra-summary");

    elements.commentaries =
        document.querySelector("#sutra-commentaries");

    elements.references =
        document.querySelector("#sutra-references");
}

function renderSutra(sutra) {

    document.title =
        `${sutra.number} ${sutra.title} | BrahmaSutrasOnline`;

    elements.breadcrumb.textContent =
        sutra.number;

    elements.number.textContent =
        `Brahma Sūtra ${sutra.number}`;

    elements.title.textContent =
        sutra.title;

    elements.sanskrit.textContent =
        sutra.text?.sanskrit || "";

    elements.iast.textContent =
        sutra.text?.iast || "";

    renderTranslations(
        sutra.translations || []
    );

    elements.summary.textContent =
        sutra.summary || "";

    renderCommentaries(
        sutra.commentaries || []
    );

    renderReferences(
        sutra.references || []
    );

    elements.loading.hidden = true;
    elements.content.hidden = false;
}

function renderTranslations(translations) {

    elements.translations.replaceChildren();

    if (!translations.length) {

        const message =
            document.createElement("p");

        message.textContent =
            "Translation forthcoming.";

        elements.translations.appendChild(message);

        return;
    }

    translations.forEach(translation => {

        const section =
            document.createElement("article");

        const heading =
            document.createElement("h3");

        heading.textContent =
            translation.translator ||
            "Translation";

        const text =
            document.createElement("p");

        text.textContent =
            translation.text || "";

        section.append(
            heading,
            text
        );

        elements.translations.appendChild(section);
    });
}

function renderCommentaries(commentaries) {

    elements.commentaries.replaceChildren();

    if (!commentaries.length) {

        const message =
            document.createElement("p");

        message.textContent =
            "Commentary material forthcoming.";

        elements.commentaries.appendChild(message);

        return;
    }

    commentaries.forEach(commentary => {

        const section =
            document.createElement("article");

        const heading =
            document.createElement("h3");

        heading.textContent =
            commentary.author || "Commentary";

        const text =
            document.createElement("p");

        text.textContent =
            commentary.content || "";

        section.append(
            heading,
            text
        );

        elements.commentaries.appendChild(section);
    });
}

function renderReferences(references) {

    elements.references.replaceChildren();

    if (!references.length) {

        const item =
            document.createElement("li");

        item.textContent =
            "References forthcoming.";

        elements.references.appendChild(item);

        return;
    }

    references.forEach(reference => {

        const item =
            document.createElement("li");

        item.textContent =
            reference.title ||
            reference.type ||
            "Reference";

        elements.references.appendChild(item);
    });
}

function showError(message) {

    elements.loading.hidden = true;

    elements.error.textContent = message;

    elements.error.hidden = false;
}
