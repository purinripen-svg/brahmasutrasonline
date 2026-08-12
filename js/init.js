import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    try {
        renderHeader();
    } catch (e) {
        console.error("Header failed", e);
    }

    try {
        renderFooter();
    } catch (e) {
        console.error("Footer failed", e);
    }
});
