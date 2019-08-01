import * as assert from 'assert';
import { Instance, SupportedRecordsHelper, SupportedRecords } from '../../ServiceNow/all';
import { commands } from "vscode";

// Defines a Mocha test suite to group tests of similar kind together
suite("CodeNow Integration", async function ()
{
    this.timeout(10000);

    let instance: Instance | undefined;
    test("Extension can connect", async () =>
    {
        instance = await commands.executeCommand<Instance>("cn.connect", { instanceName: process.env.npm_config_instanceName, userName: process.env.npm_config_userName, password: process.env.npm_config_password });
        if (instance)
        {
            assert.equal((instance.IsInitialized()), true);
        }
    });

    suite("Record Caching", async () =>
    {
        let allSupported: Array<string> = SupportedRecordsHelper.GetRecordsDisplayValue();

        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        allSupported.forEach(async (type) =>
        {
            test(`${type} cached`, async () =>
            {
                //@ts-ignore index error false
                let recType: SupportedRecords = SupportedRecords[type];

                //@ts-ignore
                let cached = await instance.GetRecords(recType);

                assert.ok(cached.length > 0, `${cached.length} found`);
            });
        });
    });
});