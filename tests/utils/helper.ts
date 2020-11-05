/* eslint-disable @typescript-eslint/no-var-requires */
// import {fs} from "fs";
import * as fs from "fs";
// const fs = require("fs");
const path = require("path");
const base_DIR = path.join(__dirname, "../data/results");

export async function getExpectedDict<T>(testData: string): Promise<Record<string, T | null>> {
    const filePath = path.join(base_DIR, testData + ".json");
    console.log(filePath);
    if (await fs.existsSync(filePath)) {
        const expectedResults: Record<string, T> = await JSON.parse(fs.readFileSync(filePath, "utf8"));
        return expectedResults;
    } else
        return {};
}

export async function getExpected<T>(testData: string, key: string): Promise<T | null> {
    const expectedResults = await getExpectedDict<T>(testData);
    if (expectedResults[key]) {
        return expectedResults[key];
    } else {
        return null;
    }
}

export async function updateExpected<T>(testData: string, key: string, result: T | null) {
    const expectedResults = await getExpectedDict<T>(testData);

    expectedResults[key] = result;

    const filePath = path.join(base_DIR, testData + ".json");
    const stringResults = JSON.stringify(expectedResults, null, 4);
    await fs.writeFileSync(filePath, stringResults);
}