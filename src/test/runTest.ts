import * as path from 'path';
import * as fs from 'fs';
import { runTests } from 'vscode-test';
import * as os from 'os';

async function main()
{
    // npm run test --instanceName=Name --username=User --password=pass
    // console.log(process.env.npm_config_instanceName);
    // console.log(process.env.npm_config_username);
    // console.log(process.env.npm_config_password);

    const testWorkspace = fs.mkdtempSync(path.resolve(__dirname, os.tmpdir(), "testRun-"));
    console.log("workspace: " + testWorkspace);
    try
    {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionPath = path.resolve(__dirname, '../../');

        // The path to the extension test script
        // Passed to --extensionTestsPath
        const testRunnerPath = path.resolve(__dirname, './suite/');

        //Download VS Code, unzip it and run the integration test
        await runTests({
            extensionPath,
            testRunnerPath,
            testWorkspace,
            testRunnerEnv: {
                instanceName: process.env.npm_config_instanceName,
                userName: process.env.npm_config_username,
                password: process.env.npm_config_password
            }
        });
    } catch (err)
    {
        console.log(err);
        console.error('Failed to run tests');
        process.exit(1);
    }
}
main();