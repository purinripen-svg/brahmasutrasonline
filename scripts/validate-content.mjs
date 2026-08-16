import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");

const CONTENT_DIR = path.join(ROOT, "content", "sutras");
const SCHEMA_DIR = path.join(ROOT, "schemas");

const INDEX_FILE = path.join(
    CONTENT_DIR,
    "index.json"
);

const SUTRA_SCHEMA_FILE = path.join(
    SCHEMA_DIR,
    "sutra.schema.json"
);

const INDEX_SCHEMA_FILE = path.join(
    SCHEMA_DIR,
    "sutra-index.schema.json"
);

const INDEX_RECORD_SCHEMA_FILE = path.join(
    SCHEMA_DIR,
    "sutra-index-record.schema.json"
);

const ajv = new Ajv({
    allErrors: true,
    strict: true
});

addFormats(ajv);

function fail(message) {
    console.error(`\n❌ ${message}\n`);
    process.exitCode = 1;
}

async function readJson(file) {
    const contents = await fs.readFile(file, "utf8");
    return JSON.parse(contents);
}

async function main() {

    console.log("BrahmaSutrasOnline content validation");
    console.log("--------------------------------------");

    const [
        index,
        sutraSchema,
        indexSchema,
        indexRecordSchema
    ] = await Promise.all([
        readJson(INDEX_FILE),
        readJson(SUTRA_SCHEMA_FILE),
        readJson(INDEX_SCHEMA_FILE),
        readJson(INDEX_RECORD_SCHEMA_FILE)
    ]);

    ajv.addSchema(
        indexRecordSchema,
        "sutra-index-record.schema.json"
    );

    const validateIndex = ajv.compile(indexSchema);
    const validateSutra = ajv.compile(sutraSchema);

    if (!validateIndex(index)) {
        console.error(validateIndex.errors);
        fail("index.json failed schema validation.");
        return;
    }

    const ids = new Set();
    const numbers = new Set();

    for (const record of index.records) {

        if (ids.has(record.id)) {
            fail(`Duplicate sūtra ID: ${record.id}`);
        }

        if (numbers.has(record.number)) {
            fail(
                `Duplicate sūtra number: ${record.number}`
            );
        }

        ids.add(record.id);
        numbers.add(record.number);

        const filePath = path.join(
            ROOT,
            record.path
        );

        try {

            const sutra =
                await readJson(filePath);

            if (!validateSutra(sutra)) {

                console.error(
                    validateSutra.errors
                );

                fail(
                    `${record.id} failed schema validation.`
                );

                continue;
            }

            if (sutra.id !== record.id) {
                fail(
                    `${record.id}: record ID does not match file ID.`
                );
            }

            if (sutra.number !== record.number) {
                fail(
                    `${record.id}: number mismatch.`
                );
            }

            if (sutra.adhyaya !== record.adhyaya) {
                fail(
                    `${record.id}: Adhyāya mismatch.`
                );
            }

            if (sutra.pada !== record.pada) {
                fail(
                    `${record.id}: Pāda mismatch.`
                );
            }

            console.log(
                `✓ ${record.number} ${record.title}`
            );

        } catch (error) {

            fail(
                `${record.id}: unable to load ${record.path}`
            );
        }
    }

    if (
        index.totalSutras !==
        index.records.length
    ) {
        fail(
            `totalSutras is ${index.totalSutras}, ` +
            `but ${index.records.length} records exist.`
        );
    }

    if (process.exitCode !== 1) {
        console.log(
            `\n✓ Corpus validation passed.`
        );

        console.log(
            `✓ ${index.records.length} indexed record(s) checked.`
        );
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
