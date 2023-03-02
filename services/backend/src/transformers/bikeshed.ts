import {WrappedChildProcess} from "../utils/wrapped-child-process";
import temp from "temp";
import * as path from "path";
import * as fs from "fs";
import rimraf from "rimraf";

/**
 * Returns content of a html document generated by tabatkins/bikeshed generator from the input source.
 * Requires bikeshed to be installed and in the path.
 * @param input Content of the sources .bs file.
 */
export async function generateBikeshed(input: string): Promise<string> {
    temp.track();
    return new Promise((resolve, reject) => {
        temp.mkdir('specification-manager', async function(err, dirPath) {
            try {
                const inputFileName = path.join(dirPath, 'input.bs');
                await fs.promises.writeFile(inputFileName, input);
                await (new WrappedChildProcess("bikeshed", ["--die-on=nothing", "spec", inputFileName]))
                    .setWorkingDirectory(dirPath).execute();
                const result = await fs.promises.readFile(path.join(dirPath, 'input.html'), 'utf8');
                await rimraf(dirPath);
                resolve(result);
            } catch (e) {
                console.log("generateBikeshed error:", e);
                reject(e);
            }
        });
    });
}
