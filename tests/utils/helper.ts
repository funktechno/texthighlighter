import fs from "fs";

export async function getExpectedDict(testData: string): Promise<Record<string, any>> {
    const filePath = "" + testData + ".json";
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        const expectedResults: Record<string, any> = await JSON.parse(fs.readFileSync(filePath, "utf8"));
        return expectedResults;
    } else
        return {};
}

export async function getExpected(testData: string, key: string): Promise<any> {

    return await getExpectedDict(testData)[key];

}

export async function updateExpected(testData: string, key: string, result: any) {
    const expectedResults = await getExpectedDict(testData);
    expectedResults[key] = result;
    fs.writeFile(testData + ".json", JSON.stringify(expectedResults, null, 4), function (err) {
        if (err) return console.log(err);
        console.log("Expected result updated:" + testData + " key:" + key);
    });
}