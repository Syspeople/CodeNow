import * as assert from 'assert';
import { Instance, SupportedRecordsHelper, SupportedRecords, Converter } from '../../ServiceNow/all';
//import { } from "../../MixIns/all";
import { commands } from "vscode";
import { WorkspaceManager, MetaData } from '../../Manager/all';
import * as path from 'path';
import * as fs from 'fs';

//surpress log output
//console.log = function () { };
console.warn = function () { };
console.error = function () { };

// Defines a Mocha test suite to group tests of similar kind together
suite("CodeNow Integration", async function ()
{
    this.timeout(30000);

    let instance: Instance | undefined;
    test("Extension can connect", async () =>
    {
        instance = await commands.executeCommand<Instance>("cn.connect", { instanceName: process.env.npm_config_instanceName, userName: process.env.npm_config_userName, password: process.env.npm_config_password });
        if (instance)
        {
            assert.equal((instance.IsInitialized()), true);
        }
    });

    let allSupported: Array<string> = SupportedRecordsHelper.GetRecordsDisplayValue();

    suite("Record Caching", async () =>
    {
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

                if (instance)
                {
                    let cached = await instance.GetRecords(recType);

                    assert.ok(cached.length > 0, `${cached.length} found`);
                }
            });
        });
    });

    suite("Add Records to WorkSpace", async () =>
    {
        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        allSupported.forEach(async (type) =>
        {
            let added: MetaData | undefined;

            test(`${type} Added`, async () =>
            {
                //@ts-ignore index error false
                let recType: SupportedRecords = SupportedRecords[type];

                if (instance)
                {
                    let wm = new WorkspaceManager(instance.WorkspaceStateManager);

                    let cached = await instance.GetRecords(recType);

                    added = await wm.AddRecord(cached[0], instance);

                    test('Record have been Added', () =>
                    {
                        assert.equal(added === undefined, false);
                    });
                }
            });

            test(`${type} Files Created properly`, () =>
            {
                this.retries(3);
                if (added)
                {
                    let files = added.Files;
                    let basedir = added.getRecordUri();

                    files.forEach((kv) =>
                    {
                        let fullPath = `${basedir.fsPath}${kv.value.fsPath}`;
                        console.error(fullPath);
                        assert.equal(fs.existsSync(fullPath), true, `file exist at: ${fullPath}`);

                        let ext = Converter.getFileTypeExtension(kv.key);
                        let baseName = path.basename(fullPath);

                        assert.equal(baseName.endsWith(ext), true, `Extension is: ${ext}`);
                    });
                }
            });
        });
    });
});