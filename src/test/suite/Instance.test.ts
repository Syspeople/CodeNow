import * as assert from 'assert';
import { Instance, SupportedRecordsHelper, SupportedRecords, Converter, AngularProvider, UiPage, ValidationScript, ScriptedRestResource } from '../../ServiceNow/all';
import { ISysMetadataIWorkspaceConvertable } from "../../MixIns/all";
import { commands } from "vscode";
import { WorkspaceManager, MetaData } from '../../Manager/all';
import * as path from 'path';
import * as fs from 'fs';

//surpress log output
//console.log = function () { };
// console.warn = function () { };
console.error = function () { };

/**
 * Ensure: 
 * Deleted on instance false positive. 
 * UI Pages
 * Validation script
 * Rest operations
 * angular providers
 * 
 * NB: Got throttled for in one test run, mught be why there is above where not deleted., either way the test case should still fail. 
 * Promise reject for 403 status code is not caught properly. 
 * 
 * stack trace: Error: Request failed with status code 403
    at createError (C:\Users\AsbjørnSørensen\Repo\CodeNow\node_modules\axios\lib\core\createError.js:16:15)
    at settle (C:\Users\AsbjørnSørensen\Repo\CodeNow\node_modules\axios\lib\core\settle.js:17:12)
    at IncomingMessage.handleStreamEnd (C:\Users\AsbjørnSørensen\Repo\CodeNow\node_modules\axios\lib\adapters\http.js:237:11)
    at IncomingMessage.emit (events.js:187:15)
    at endReadableNT (_stream_readable.js:1092:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
 */


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

    suite("Add/remove Records in WorkSpace", async () =>
    {
        this.retries(3);

        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        test('Instance defined', () =>
        {
            assert.equal(instance !== undefined, true);
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
                if (added)
                {
                    let files = added.Files;
                    let basedir = added.getRecordUri();

                    files.forEach((kv) =>
                    {
                        let fullPath = `${basedir.fsPath}${kv.value.fsPath}`;
                        assert.equal(fs.existsSync(fullPath), true, `file do not exist at: ${fullPath}, should have been created,`);

                        let ext = Converter.getFileTypeExtension(kv.key);
                        let baseName = path.basename(fullPath);

                        assert.equal(baseName.endsWith(ext), true, `Extension is not: ${ext}`);
                    });
                }
            });

            test(`Delete ${type} from workspace`, async () =>
            {
                if (instance && added)
                {
                    //delete does not throw
                    let wm = new WorkspaceManager(instance.WorkspaceStateManager);
                    assert.doesNotThrow(async () =>
                    {
                        if (added)
                        {
                            await wm.DeleteRecord(added);
                        }
                    }, "Delete file from workspace threw");

                    //all files have been removed
                    let files = added.Files;
                    let basedir = added.getRecordUri();

                    files.forEach((kv) =>
                    {
                        let fullPath = `${basedir.fsPath}${kv.value.fsPath}`;
                        assert.equal(fs.existsSync(fullPath), false, `file exist at: ${fullPath}, should have been deletede.`);
                    });
                }
            });
        });
    });

    suite('Create and Delete records on instance', async () =>
    {
        this.retries(3);
        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        test('Instance defined', () =>
        {
            assert.equal(instance !== undefined, true);
        });

        let WsName = process.env.npm_config_workspaceName;
        //let additionalRecordsToDelete: Array<ISysMetadataIWorkspaceConvertable> = new Array<ISysMetadataIWorkspaceConvertable>();

        allSupported.forEach(async (type) =>
        {
            //@ts-ignore index error false
            let recType: SupportedRecords = SupportedRecords[type];

            let availableTypes: Array<string>;
            let shouldContain: number = 0;
            let createdRecords: Array<ISysMetadataIWorkspaceConvertable> = new Array<ISysMetadataIWorkspaceConvertable>();

            test(`Create ${type} on instance`, async () =>
            {
                let name = `${WsName}_${recType}`;

                //handle record types with special requiements.
                switch (recType)
                {
                    case SupportedRecords["Angular Provider"]:

                        availableTypes = AngularProvider.getTypes();

                        availableTypes.forEach(async (apType) =>
                        {
                            //@ts-ignore
                            let r = await instance.CreateRecord(recType, {
                                'name': `${name}_${apType}`,
                                'category': apType
                            });
                            createdRecords.push(r);
                            shouldContain++;
                        });
                        break;

                    case SupportedRecords["UI Page"]:

                        availableTypes = UiPage.getCategory();

                        availableTypes.forEach(async (uipType) =>
                        {
                            //@ts-ignore
                            let r = await instance.CreateRecord(recType, {
                                'name': `${name}_${uipType}`,
                                'category': uipType
                            });
                            createdRecords.push(r);
                            shouldContain++;
                        });
                        break;

                    case SupportedRecords["Validation Script"]:
                        availableTypes = ValidationScript.getTypes();

                        availableTypes.forEach(async (vsType) =>
                        {
                            //@ts-ignore
                            let r = await instance.CreateRecord(recType, {
                                'name': `${name}_${vsType}`,
                                'internal_type': vsType
                            });

                            createdRecords.push(r);
                            shouldContain++;
                        });
                        break;

                    case SupportedRecords["Scripted Rest API"]:

                        //create service
                        //@ts-ignore
                        let definition = await instance.CreateRecord(SupportedRecords["Scripted Rest Definition"], {
                            'name': name
                        });

                        createdRecords.push(definition);
                        shouldContain++;

                        availableTypes = ScriptedRestResource.getOperations();

                        availableTypes.forEach(async (apiOp) =>
                        {
                            //@ts-ignore
                            let r = await instance.CreateRecord(recType, {
                                'name': `${name}_${apiOp}`,
                                'web_service_definition': definition.sys_id,
                                'http_method': apiOp,
                            });
                            createdRecords.push(r);
                            shouldContain++;
                        });

                        break;
                    default:
                        //@ts-ignore
                        createdRecords.push(await instance.CreateRecord(recType, {
                            'name': name
                        }));
                        shouldContain++;
                        break;
                }
                assert.equal(shouldContain, createdRecords.length, `Expected ${shouldContain}, ${createdRecords.length} have been created`);
            });

            test(`Can delete ${type} records`, () =>
            {
                createdRecords.forEach(async (r) =>
                {
                    assert.doesNotThrow(async () =>
                    {
                        if (instance)
                        {
                            await instance.DeleteRecord(r);
                        }
                    }, `Deletion of record ${r.sys_class_name}\\${r.sys_id} failed`);
                });
            });
            //adding files to workspace tested through integration tests for adding records. No need to test twice. 
        });
    });
});