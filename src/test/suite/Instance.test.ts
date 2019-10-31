import * as assert from 'assert';
import { Instance, SupportedRecordsHelper, SupportedRecords, Converter, AngularProvider, UiPage, ValidationScript, ScriptedRestResource, UpdateSet } from '../../ServiceNow/all';
//import { ISysMetadataIWorkspaceConvertable } from "../../MixIns/all";
import { commands } from "vscode";
import { WorkspaceManager, MetaData } from '../../Manager/all';
import * as path from 'path';
import * as fs from 'fs';
import { ISysMetadataIWorkspaceConvertable } from '../../MixIns/all';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

//surpress log output
//console.log = function () { };
//console.warn = function () { };
//console.error = function () { };

/** todo
 * 
 * update set validation
 */

// Defines a Mocha test suite to group tests of similar kind together
suite("CodeNow Integration", async function ()
{
    this.timeout(60000);

    let instance: Instance | undefined;
    let allSupported: Array<string> = SupportedRecordsHelper.GetRecordsDisplayValue();

    test("Extension can connect", async () =>
    {
        instance = await commands.executeCommand<Instance>("cn.connect", { instanceName: process.env.npm_config_instanceName, userName: process.env.npm_config_userName, password: process.env.npm_config_password });
        if (instance)
        {
            assert.equal((instance.IsInitialized()), true);

            //Initial caching
            allSupported.forEach(async (type) =>
            {
                test(`${type} cached`, async () =>
                {
                    //@ts-ignore index error false
                    let recType: SupportedRecords = SupportedRecords[type];
                    if (instance)
                    {
                        let cached = await instance.GetRecords(recType);
                        console.error(`${cached.length} Cached of ${type}`);
                        return chai.expect(cached.length).to.be.greaterThan(0);
                    }
                });
            });

            test('Refresh of records', () =>
            {
                if (instance)
                {
                    chai.expect(instance.RebuildCache()).to.not.Throw();
                }
            });

            //Initial caching
            allSupported.forEach(async (type) =>
            {
                test(`${type} cached after Refresh`, async () =>
                {
                    //@ts-ignore index error false
                    let recType: SupportedRecords = SupportedRecords[type];

                    if (instance)
                    {
                        let cached = await instance.GetRecords(recType);
                        console.error(`${cached.length} Cached of ${type}`);
                        return chai.expect(cached.length).to.be.greaterThan(0);
                    }
                });
            });

            test('Application stored in local cache', async () =>
            {
                if (instance)
                {
                    let app = instance.WorkspaceStateManager.getApplication();
                    await chai.expect(app).to.exist;
                }
            });

            test('Updateset stored in local cache', async () =>
            {
                if (instance)
                {
                    let app = instance.WorkspaceStateManager.GetUpdateSet();
                    await chai.expect(app).to.exist;
                }
            });
        }
    });

    suite.skip("Record Caching", async () =>
    {
        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        //Initial caching
        allSupported.forEach(async (type) =>
        {
            test(`${type} cached`, async () =>
            {
                //@ts-ignore index error false
                let recType: SupportedRecords = SupportedRecords[type];
                console.error(`Instance is defined: ${(instance)}`);
                if (instance)
                {
                    let cached = await instance.GetRecords(recType);
                    console.error(`${cached.length} Cached of ${type}`);
                    return chai.expect(cached.length).to.be.greaterThan(0);
                }
            });
        });

        test("Refresh Records", async () =>
        {
            await chai.expect(commands.executeCommand('cn.rebuildCache')).to.be.fulfilled;
        });

        allSupported.forEach(async (type) =>
        {
            test(`${type} cached after refresh`, async () =>
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

    suite("CRUD Operations in Workspace", async () =>
    {
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

                    let records = await instance.GetRecordsUpstream(recType);

                    added = await wm.AddRecord(records[0], instance);

                    assert.equal(added === undefined, false);
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

    suite('Record Operations  - instance', async () =>
    {
        test("Supported Records found", () =>
        {
            assert.ok(allSupported.length > 0);
        });

        test('Instance defined', () =>
        {
            assert.equal(instance !== undefined, true);
        });


        for (let index = 0; index < allSupported.length; index++) 
        {
            const recordType = allSupported[index];

            //@ts-ignore index error false
            let recType: SupportedRecords = SupportedRecords[recordType];

            let availableTypes: Array<string>;

            let name = `${process.env.workspaceName}_${recType}`;

            //handle record types with special requirements.
            switch (recType)
            {
                case SupportedRecords["Angular Provider"]:

                    suite(`CRUD for ${recType}`, () =>
                    {
                        availableTypes = AngularProvider.getTypes();

                        availableTypes.forEach(async (type) =>
                        {
                            let createdRecord: ISysMetadataIWorkspaceConvertable;
                            test(`Create: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    createdRecord = await instance.CreateRecord(recType, {
                                        'name': `${name}_${type}`,
                                        'type': type
                                    });

                                    assert.equal(createdRecord !== undefined, true, `Record not Created`);

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);

                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);
                                }
                            });

                            test(`Update: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    //implement me ensure updates are saved on instance
                                    let fileTypes = Converter.getFileTypes();

                                    let testValue = "testvalue";

                                    fileTypes.forEach(element =>
                                    {
                                        createdRecord.SetAttribute(testValue, element);
                                    });

                                    await chai.expect(instance.SaveRecord(createdRecord)).to.be.fulfilled.and.exist;

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);
                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);

                                    let promises = Array<Object>();
                                    fileTypes.forEach(async element =>
                                    {
                                        promises.push(chai.expect(Promise.resolve(createdRecordFromInstance.GetAttribute(element))).to.be.fulfilled.and.eventually.be.oneOf([testValue, undefined]));
                                    });
                                    return Promise.all(promises);
                                }
                            });

                            test(`Delete: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    await chai.expect(instance.DeleteRecord(createdRecord)).to.be.fulfilled;

                                    await chai.expect(instance.GetRecord(createdRecord)).to.be.rejectedWith('status code 404');
                                }
                            });
                        });
                    });

                    break;

                case SupportedRecords["UI Page"]:
                    suite(`CRUD for ${recType}`, () =>
                    {
                        availableTypes = UiPage.getCategory();

                        availableTypes.forEach(async (type) =>
                        {
                            let createdRecord: ISysMetadataIWorkspaceConvertable;
                            test(`Create: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    createdRecord = await instance.CreateRecord(recType, {
                                        'name': `${name}_${type}`,
                                        'category': type
                                    });

                                    assert.equal(createdRecord !== undefined, true, `Record not Created`);

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);

                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);
                                }
                            });


                            test(`Update: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    //implement me ensure updates are saved on instance
                                    let fileTypes = Converter.getFileTypes();

                                    let testValue = "testvalue";

                                    fileTypes.forEach(element =>
                                    {
                                        createdRecord.SetAttribute(testValue, element);
                                    });

                                    await chai.expect(instance.SaveRecord(createdRecord)).to.be.fulfilled.and.exist;

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);
                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);

                                    let promises = Array<Object>();
                                    fileTypes.forEach(async element =>
                                    {
                                        promises.push(chai.expect(Promise.resolve(createdRecordFromInstance.GetAttribute(element))).to.eventually.be.oneOf([testValue, undefined]));
                                    });
                                    return Promise.all(promises);
                                }
                            });

                            test(`Delete: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    await chai.expect(instance.DeleteRecord(createdRecord)).to.be.fulfilled;

                                    await chai.expect(instance.GetRecord(createdRecord)).to.be.rejectedWith('status code 404');
                                }
                            });
                        });
                    });

                    break;

                case SupportedRecords["Validation Script"]:

                    suite(`CRUD for ${recType}`, () =>
                    {
                        availableTypes = ValidationScript.getTypes();

                        //only subset of types
                        availableTypes.slice(0, 10).forEach(async (type) =>
                        {
                            let createdRecord: ISysMetadataIWorkspaceConvertable;
                            test(`Create: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    createdRecord = await instance.CreateRecord(recType, {
                                        'description': `${name}_${type}`,
                                        'internal_type': type
                                    });

                                    assert.equal(createdRecord !== undefined, true, `Record not Created`);

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);

                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);
                                }
                            });


                            test(`Update: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    //implement me ensure updates are saved on instance
                                    let fileTypes = Converter.getFileTypes();

                                    let testValue = "testvalue";

                                    fileTypes.forEach(element =>
                                    {
                                        createdRecord.SetAttribute(testValue, element);
                                    });

                                    await chai.expect(instance.SaveRecord(createdRecord)).to.eventually.not.become(undefined);

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);
                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);

                                    let promises = Array<Object>();
                                    fileTypes.forEach(async element =>
                                    {
                                        promises.push(chai.expect(Promise.resolve(createdRecordFromInstance.GetAttribute(element))).to.be.fulfilled.and.eventually.be.oneOf([testValue, undefined]));
                                    });
                                    return Promise.all(promises);
                                }
                            });

                            test(`Delete: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    await chai.expect(instance.DeleteRecord(createdRecord)).to.be.fulfilled;

                                    await chai.expect(instance.GetRecord(createdRecord)).to.be.rejectedWith('status code 404');
                                }
                            });
                        });
                    });
                    break;

                case SupportedRecords["Scripted Rest API"]:

                    suite(`CRUD for ${recType}`, () =>
                    {
                        let definition: ISysMetadataIWorkspaceConvertable;
                        test('Create Definition', async () =>
                        {
                            if (instance)
                            {
                                definition = await instance.CreateRecord(SupportedRecords["Scripted Rest Definition"], {
                                    'name': name
                                });
                            }
                            return chai.expect(definition).exist;
                        });


                        availableTypes = ScriptedRestResource.getOperations();
                        availableTypes.forEach(async (type) =>
                        {
                            let createdRecord: ISysMetadataIWorkspaceConvertable;
                            test(`Create Operation: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    createdRecord = await instance.CreateRecord(recType, {
                                        'name': `${name}_${type}`,
                                        'category': type
                                    });

                                    assert.equal(createdRecord !== undefined, true, `Record not Created`);

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);

                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);
                                }
                            });

                            test(`Update: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    let fileTypes = Converter.getFileTypes();

                                    let testValue = "testvalue";

                                    fileTypes.forEach(element =>
                                    {
                                        createdRecord.SetAttribute(testValue, element);
                                    });

                                    await chai.expect(instance.SaveRecord(createdRecord)).to.be.fulfilled.and.exist;

                                    let createdRecordFromInstance = await instance.GetRecord(createdRecord);
                                    assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);

                                    let promises = Array<Object>();
                                    fileTypes.forEach(async element =>
                                    {
                                        promises.push(chai.expect(Promise.resolve(createdRecordFromInstance.GetAttribute(element))).to.be.fulfilled.and.eventually.be.oneOf([testValue, undefined]));
                                    });
                                    return Promise.all(promises);
                                }
                            });

                            test(`Delete Operation: ${type}`, async () =>
                            {
                                if (instance)
                                {
                                    await chai.expect(instance.DeleteRecord(createdRecord)).to.be.fulfilled;

                                    await chai.expect(instance.GetRecord(createdRecord)).to.be.rejectedWith('status code 404');
                                }
                            });
                        });

                        test(`Delete Definition:`, async () =>
                        {
                            if (instance)
                            {
                                await chai.expect(instance.DeleteRecord(definition)).to.be.fulfilled;

                                await chai.expect(instance.GetRecord(definition)).to.be.rejectedWith('status code 404');
                            }
                        });
                    });
                    break;
                default:
                    suite(`CRUD for ${recType}`, () =>
                    {
                        let createdRecord: ISysMetadataIWorkspaceConvertable;
                        test(`Create`, async () =>
                        {
                            if (instance)
                            {
                                createdRecord = await instance.CreateRecord(recType, {
                                    'name': `${name}`
                                });

                                assert.equal(createdRecord !== undefined, true, `Record not Created`);

                                let createdRecordFromInstance = await instance.GetRecord(createdRecord);

                                assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);
                            }
                        });


                        test(`Update`, async () =>
                        {
                            if (instance)
                            {
                                //implement me ensure updates are saved on instance
                                let fileTypes = Converter.getFileTypes();

                                let testValue = "testvalue";

                                fileTypes.forEach(element =>
                                {
                                    createdRecord.SetAttribute(testValue, element);
                                });

                                await chai.expect(instance.SaveRecord(createdRecord)).to.be.fulfilled.and.exist;

                                let createdRecordFromInstance = await instance.GetRecord(createdRecord);
                                assert.equal(createdRecordFromInstance !== undefined, true, `Unable to retrieve the created record from instance`);

                                let promises = Array<Object>();
                                fileTypes.forEach(async element =>
                                {
                                    promises.push(chai.expect(Promise.resolve(createdRecordFromInstance.GetAttribute(element))).to.be.fulfilled.and.eventually.be.oneOf([testValue, undefined]));
                                });
                                return Promise.all(promises);
                            }
                        });


                        test(`Delete`, async () =>
                        {
                            if (instance)
                            {
                                await instance.DeleteRecord(createdRecord);

                                await chai.expect(instance.GetRecord(createdRecord)).to.be.rejectedWith('status code 404');
                            }
                        });
                    });
                    break;
            }
        }
        //add/remove files to workspace tested through integration tests for adding records. No need to test twice. 
    });

    suite('Instance Updateset and Scope', () =>
    {
        test('Instance defined', () =>
        {
            assert.equal(instance !== undefined, true);
        });

        test('Change Update Set', async () =>
        {
            if (instance)
            {
                let us = await instance.GetUpdateSets();

                let usNotDefault = us.filter((item) =>
                {
                    return item.is_default === 'false';
                });

                await chai.expect(instance.SetUpdateSet(usNotDefault[0])).to.be.fulfilled;
                chai.expect(instance.WorkspaceStateManager.GetUpdateSet()).to.exist.and.be.eq(usNotDefault[0]);
            }
        });

        test('Change Scope', async () =>
        {
            if (instance)
            {
                let scope = await instance.getApplication();

                let scopeNotDefaultOrCurrent = scope.list.filter((item) =>
                {
                    return item.sysId !== "global" && item.sysId !== scope.current;
                });

                await instance.setApplication(scopeNotDefaultOrCurrent[0]);

                let currentScopeOnInstance = await instance.getCurrentApplication();

                chai.expect(currentScopeOnInstance.sysId).to.be.eq(scopeNotDefaultOrCurrent[0].sysId);
                //us should be default
                let UpdateSetLocal = instance.WorkspaceStateManager.GetUpdateSet();
                chai.expect(UpdateSetLocal).to.be.instanceOf(UpdateSet).and.to.have.property('is_default', "true");
                //selected app should be cached
                chai.expect(instance.WorkspaceStateManager.getApplication()).to.exist.and.to.have.property("sysId", scopeNotDefaultOrCurrent[0].sysId);
            }
        });
    });
});